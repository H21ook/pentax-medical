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
      const result = await dialog.showOpenDialog({
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

  ipcMain.on('print-pdf', async (event, { html, uuid, createdDate }) => {
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        contextIsolation: true,
        sandbox: false,
        webSecurity: false,
        enableRemoteModule: false
      }
    })
    const fullHtml = `<html><head><meta charset="UTF-8" /><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: file:; media-src 'self' blob: file:"  /></head<body>${html}</body></html>`
    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`)

    printWindow.webContents.insertCSS(`
        .paper {
          border: 1px solid black;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .header {
          font-weight: bold;
        }

        .gridWrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .subGrid {
          display: grid;
          grid-template-columns: 150px 1fr;
          font-size: 14px;
        }

        .imageWrapper {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid black;
        }

        .imageWrapper img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .imageTitleWrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .imageNumber {
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          width: 24px;
          background-color: red;
        }
      `)

    // Wait for the content to load, then print to PDF
    printWindow.webContents.on('did-finish-load', async () => {
      const dataConfig = getDataConfig()
      const date = format(createdDate, 'yyyy-MM-dd')
      const pdfPath = join(`${dataConfig.directory}/${date}/${uuid}`, 'report.pdf')

      const pdfData = await printWindow.webContents.printToPDF({
        pageSize: 'A4',
        printBackground: true
      })
      fs.writeFile(pdfPath, pdfData, (err) => {
        if (err) {
          console.error('Failed to save PDF:', err)
        } else {
          console.log('PDF saved to:', pdfPath)
        }
        printWindow.close()
      })

      const printPdfWindow = new BrowserWindow({
        width: 900,
        height: 800,
        center: true,
        autoHideMenuBar: true,
        resizable: false,
        frame: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
          nodeIntegration: true
        }
      })

      // Load the PDF file (replace with your file path)
      printPdfWindow.loadURL(`file:///${pdfPath}`)

      // Trigger printing
      printPdfWindow.webContents.on('did-finish-load', () => {
        // printPdfWindow.webContents.print(
        //   {
        //     printBackground: true
        //   },
        //   (success, failureReason) => {
        //     if (success) {
        //       console.log('Print job was successful')
        //     } else {
        //       console.log('Print job failed:', failureReason)
        //     }
        //   }
        // )
      })
      // printWindow.webContents.print(
      //   {
      //     silent: false,
      //     printBackground: true, // Include background styles and colors
      //     pageSize: 'A4'
      //   },
      //   (success, errorType) => {
      //     if (!success) console.error('Print operation failed:', errorType)
      //     printWindow.close() // Close the hidden window after printing
      //   }
      // )
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
