// import { updateElectronApp, UpdateSourceType } from 'update-electron-app'
import { autoUpdater, dialog } from 'electron'
// import Logger from 'electron-log'

// updateElectronApp({
//   updateSource: {
//     type: UpdateSourceType.ElectronPublicUpdateService,
//     repo: 'H21ook/pentax-medical'
//   },
//   updateInterval: '1 hour',
//   logger: Logger
// })

const server = 'https://update.electronjs.org' // Electron's update server URL
const feedURL = `${server}/H21ook/pentax-medical/${process.platform}-${process.arch}`

autoUpdater.setFeedURL({ url: feedURL })

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...')
})

autoUpdater.on('update-available', () => {
  console.log('Update available.')
})

autoUpdater.on('update-not-available', () => {
  console.log('No update available.')
})

autoUpdater.on('error', (error) => {
  console.error('Error in auto-updater:', error)
})

autoUpdater.on('download-progress', (progressObj) => {
  let percent = Math.round(progressObj.percent)
  console.log(`Download speed: ${progressObj.bytesPerSecond} - Downloaded ${percent}%`)
})

autoUpdater.on('update-downloaded', (_, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

setInterval(
  () => {
    autoUpdater.checkForUpdates()
  },
  0.5 * 60 * 1000
)
