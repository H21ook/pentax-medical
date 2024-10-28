import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import fs from 'fs'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { closeDb, initTables } from './config/database'
import { log } from './config/log'
import { checkToken } from './services/auth'
import { createMenu } from './services/menu'
import { getRootUser } from './services/user'
import { getDataConfig } from './services/system'
import './services/hospital'
import './services/address'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: false,
    resizable: false,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false
    }
  })

  const menu = createMenu(mainWindow)

  mainWindow.setMenu(menu)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('setMaximize', false)
  })

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('setMaximize', true)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initTables()

  log.info('initialized database')
  let win = createWindow()

  // win.webContents.openDevTools()

  ipcMain.on('init-page', (_e, data) => {
    const res = getRootUser()
    log.info(`Root user ${res ? 'already created.' : 'not found'}`)
    if (!res) {
      log.info(`Go to Get Started page`)
      win.webContents.send('init-page', { pageKey: 'get-started' })
      return
    }
    const res2 = checkToken(data?.token)
    if (res2.result && res2.data?.isLogged) {
      log.info(`Logged user: ${res2.data?.username}`)
      log.info(`Go to Main page`)
      win.webContents.send('init-page', { pageKey: 'main' })
      return
    }
    log.info(`Go to Login page`)
    win.webContents.send('init-page', { pageKey: 'login' })
    return
  })

  ipcMain.on('showAbout', () => {
    if (win) {
      dialog.showMessageBox(win, {
        title: 'Програмын тухай',
        type: 'info',
        message: 'Pentax',
        detail: `Энэхүү програм нь дурангийн эмч нарт зориулагдсан болно.

  Хувилбар:
      Node: v${process.versions.node}
      Chrome: v${process.versions.chrome}
      Electron: v${process.versions.electron}

  Copyright © ${new Date().getFullYear()}
        `
      })
    }
  })

  ipcMain.handle('create-documents-path', async () => {
    const configData = getDataConfig()
    if (configData.status === 'init') {
      // Check if the folder exists
      if (!fs.existsSync(configData.directory)) {
        // Create the folder if it doesn't exist
        fs.mkdirSync(configData.directory)
      }
    }

    return configData.directory
  })

  ipcMain.handle('select-directory', async (event, directory) => {
    const documentsPath = app.getPath('documents')
    const result = await dialog.showOpenDialog({
      defaultPath: directory || documentsPath,
      properties: ['openDirectory']
    })

    return result.filePaths
  })

  // renderer log
  ipcMain.on('log-error', (_e, data) => {
    log.info(`Renderer: ${data}`)
  })

  // Window buttons action
  ipcMain.on('minimize', () => {
    win.minimize()
    win.webContents.send('setMaximize', false)
  })

  ipcMain.on('maximize', () => {
    win.maximize()
  })

  ipcMain.on('restore', () => {
    win.restore()
  })

  ipcMain.on('close', () => {
    win.close()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    closeDb()
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
