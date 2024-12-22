import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, dirname } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { closeDb, initTables } from './config/database'
import { log } from './config/log'
import { checkToken } from './services/auth'
import { createMenu } from './services/menu'
import { getRootUser } from './services/user'
import './services/system'
import './services/hospital'
import './services/address'
import './services/employee'
import { getDataDirectory } from './services/file'
import { getDataConfig } from './services/system'
import { format } from 'date-fns'
import { exec } from 'child_process'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 760,
    minWidth: 1024,
    minHeight: 760,
    show: false,
    autoHideMenuBar: false,
    resizable: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false,
      webSecurity: false,
      enableRemoteModule: false
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
  electronApp.setAppUserModelId('com.h21ook.pentax-medical')

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
    return getDataDirectory()
  })

  ipcMain.handle('select-directory', async (event, directory) => {
    const documentsPath = app.getPath('documents')
    const result = await dialog.showOpenDialog({
      defaultPath: directory || documentsPath,
      properties: ['openDirectory']
    })

    return result.filePaths
  })

  ipcMain.handle(
    'dialog:openFile',
    async (_, { title = 'Файл сонгох', buttonLabel = 'Open', path, filters }) => {
      const documentsPath = app.getPath('documents')
      const result = await dialog.showOpenDialog(win, {
        title,
        buttonLabel,
        defaultPath: path || documentsPath,
        properties: ['openFile'],
        filters
      })

      return {
        path: result.filePaths[0],
        folder: dirname(result.filePaths[0])
      }
    }
  )

  ipcMain.handle('print-pdf', (e, { createdDate, uuid }) => {
    return new Promise((resolve) => {
      try {
        const printWindow = new BrowserWindow({
          show: false,
          webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            contextIsolation: true,
            sandbox: false,
            webSecurity: false,
            enableRemoteModule: false
          }
        })

        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
          printWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/print`)
        } else {
          const indexPath = join(__dirname, '../renderer/index.html')
          printWindow.loadURL(`file://${indexPath}#/print`)
        }

        printWindow.webContents.on('did-finish-load', async () => {
          const dataConfig = getDataConfig()
          const date = format(createdDate, 'yyyy-MM-dd')
          const pdfPath = join(`${dataConfig.directory}/${date}/${uuid}`, 'report.pdf')

          setTimeout(async () => {
            const pdfData = await printWindow.webContents.printToPDF({
              pageSize: 'A4',
              printBackground: true
            })

            fs.writeFile(pdfPath, pdfData, async (err) => {
              if (err) {
                log.info('Failed to save PDF ', err)
                printWindow.close()
                resolve({
                  result: false,
                  message: 'Алдаа гарлаа'
                })
              } else {
                printWindow.close()
                exec(`start "" "${pdfPath}"`, (error) => {
                  if (error) {
                    console.error('Error opening PDF:', error)
                  }
                })

                resolve({
                  result: true,
                  data: pdfPath
                })
              }
            })
          }, 2000)
        })
      } catch (err) {
        log.info('Print err ', err?.message)
        resolve({
          result: false,
          message: 'Алдаа гарлаа'
        })
        return
      }
    })
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

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  log.info(error)
  // Optionally show a dialog or notification to the user
})

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
  log.info(reason)
})
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
