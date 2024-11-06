import { app, ipcMain } from 'electron'
import { join } from 'path'
import fs from 'fs'
import os from 'os'
import { getDataConfig } from './system'
import { log } from '../config/log'
import { exec } from 'child_process'
import ffmpegPath from 'ffmpeg-static'

const createTempFolder = (uuid) => {
  const tempDir = os.tmpdir()

  const appFolder = join(tempDir, app.getName())

  // Check if the app folder exists
  if (!fs.existsSync(appFolder)) {
    // If not, create the app folder
    fs.mkdirSync(appFolder)
    log.info(`Created app temp folder: ${appFolder}`)
  }

  if (uuid) {
    const userTempFolder = join(appFolder, uuid)
    if (!fs.existsSync(userTempFolder)) {
      // If not, create the app folder
      fs.mkdirSync(userTempFolder)
      log.info(`Created user temp folder: ${userTempFolder}`)
    }

    return userTempFolder
  }

  return appFolder
}

export const getDataDirectory = () => {
  const configData = getDataConfig()
  if (configData.status === 'init') {
    // Check if the folder exists
    if (!fs.existsSync(configData.directory)) {
      // Create the folder if it doesn't exist
      fs.mkdirSync(configData.directory)
    }
  }
  return configData.directory
}

ipcMain.handle('file:saveImage', async (_, { uuid, imageData }) => {
  const tempDir = createTempFolder(uuid)
  const base64Data = imageData.replace(/^data:image\/png;base64,/, '')
  const filePath = join(tempDir, `captured-image-${Date.now()}.png`)

  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving the image:', err)
      return
    }
    console.log(`Image saved at: ${filePath}`)
  })
})

ipcMain.handle('file:saveVideoFile', async (_, { buffer, uuid }) => {
  const tempDir = createTempFolder(uuid)
  const nowDate = Date.now()
  const filePath = join(tempDir, `recording-${nowDate}.webm`)
  const fileMp4Path = join(tempDir, `recording-${nowDate}.mp4`)

  return new Promise((resolve) => {
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        log.info('Failed to save video:', err)
        resolve({
          result: false,
          message: 'Файлыг хадгалахад алдаа гарлаа'
        })
      } else {
        const command = `${ffmpegPath} -i "${filePath}" -c:v libx264 -c:a aac "${fileMp4Path}"`

        exec(command, (error) => {
          if (error) {
            log.info(`Error convert to MP4: ${error.message}`)
            return resolve({
              result: false,
              message: error?.message
            })
          }

          fs.unlink(filePath, (err) => {
            if (err) {
              log.info(`Error deleting file: ${err.message}`)
              return resolve({
                result: false,
                message: err?.message
              })
            }
            resolve({
              result: true,
              data: {
                path: fileMp4Path
              }
            })
          })
        })
      }
    })
  })
})

ipcMain.handle('file:removeTempFiles', async (_, uuid) => {
  const tempDir = os.tmpdir()
  const appFolder = join(tempDir, app.getName())
  const userTempFolder = join(appFolder, uuid)

  return new Promise((resolve) => {
    fs.rm(userTempFolder, { recursive: true, force: true }, (err) => {
      if (err) {
        log.info('Error deleting folder:', err)
        return resolve({
          result: false,
          message: err
        })
      } else {
        log.info('Folder deleted successfully: ' + uuid)
        return resolve({
          result: true,
          data: {
            path: userTempFolder
          }
        })
      }
    })
  })
})
