import { app, ipcMain } from 'electron'
import { join, extname } from 'path'
import fs from 'fs'
import os from 'os'
import { getDataConfig } from './system'
import { log } from '../config/log'
import { exec, spawn } from 'child_process'
import ffmpegPath from 'ffmpeg-static'

export const createTempFolder = (uuid) => {
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

  return new Promise((resolve) => {
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        log.info('Error saving the image:', err)
        return resolve({
          result: false,
          message: 'Зураг хадгалахад алдаа гарлаа'
        })
      }
      log.info(`Image saved at: ${filePath}`)
      return resolve({
        result: true,
        data: {
          path: filePath
        }
      })
    })
  })
})

ipcMain.handle('file:saveVideoFile', async (_, { buffer, uuid }) => {
  const tempDir = createTempFolder(uuid)
  const nowDate = Date.now()
  const localFmpegPath = ffmpegPath.replace('\\app.asar\\', '\\app.asar.unpacked\\')
  const filePath = join(tempDir, `recording-${nowDate}.webm`)
  // const fileMp4Path = join(tempDir, `recording-${nowDate}.mp4`)
  const fileWebmPath = join(tempDir, `recording-${nowDate}-metadata.webm`)

  return new Promise((resolve) => {
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        log.info('Failed to save video:', err)
        resolve({
          result: false,
          message: 'Файлыг хадгалахад алдаа гарлаа'
        })
      } else {
        log.info('Path ', ffmpegPath)
        log.info('Local ', localFmpegPath)

        // const command = `${ffmpegPath} -i "${filePath}" -c:v libx264 -c:a aac "${fileMp4Path}"`
        const command = `"${localFmpegPath}" -i "${filePath}" -c:v copy -c:a copy -map_metadata 0 "${fileWebmPath}"`

        exec(command, (error) => {
          if (error) {
            log.info(`Error copy file metadata: ${error.message}`)
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
                path: fileWebmPath
              }
            })
          })
        })
      }
    })
  })
})

ipcMain.handle('file:removeTempFiles', async (_, uuid) => {
  return new Promise((resolve) => {
    try {
      const tempDir = os.tmpdir()
      const appFolder = join(tempDir, app.getName())
      const userTempFolder = join(appFolder, uuid)

      fs.rm(userTempFolder, { recursive: true, force: true }, (err) => {
        if (err) {
          throw err
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
    } catch (err) {
      return resolve({
        result: false,
        message: err
      })
    }
  })
})

ipcMain.handle('file:removeImageFile', async (_, path) => {
  return new Promise((resolve) => {
    try {
      fs.unlink(path, (err) => {
        if (err) {
          log.info('Error deleting image file:', err)
          return resolve({
            result: false,
            message: err
          })
        } else {
          log.info('File deleted successfully: ', path)
          return resolve({
            result: true,
            data: true
          })
        }
      })
    } catch (err) {
      return resolve({
        result: false,
        message: err
      })
    }
  })
})

export const moveFilesToFolder = async (
  filesArray = [],
  destinationFolder
  //, sourceFolder
) => {
  try {
    // Ensure the destination folder exists
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true })
    }

    // Loop through each file in the array
    const moveFilesRequest = []
    const movedFiles = filesArray?.map((item, index) => {
      const { name, path: filePath } = item
      const fileExtension = extname(filePath)
      const destinationPath = join(
        destinationFolder,
        `${name.replaceAll(' ', '_')}_${index}${fileExtension}`
      )
      moveFilesRequest.push(fs.promises.copyFile(filePath, destinationPath))
      return {
        ...item,
        path: destinationPath
      }
    })

    await Promise.all(moveFilesRequest)
    // await fs.promises.rm(sourceFolder, { recursive: true })

    log.info(`Moved: ${destinationFolder}`)

    log.info(`All files moved to ${destinationFolder} successfully.`)
    return {
      result: true,
      files: movedFiles
    }
  } catch (error) {
    log.info('Error moving files:', error)
    return {
      result: false
    }
  }
}

export const moveImagesToFolder = async (filesArray, destinationFolder) => {
  try {
    // Ensure the destination folder exists
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true })
    }

    // Loop through each file in the array
    const moveFilesRequest = []
    const movedFiles = filesArray.map((item, index) => {
      const { path: filePath } = item
      const fileExtension = extname(filePath)
      const fileName = `raw-${index + 1}`
      const destinationPath = join(destinationFolder, `${fileName}${fileExtension}`)
      moveFilesRequest.push(fs.promises.copyFile(filePath, destinationPath))
      return {
        ...item,
        name: fileName,
        path: destinationPath
      }
    })

    await Promise.all(moveFilesRequest)

    log.info(`Copied: ${destinationFolder}`)

    log.info(`All files copied to ${destinationFolder} successfully.`)
    return {
      result: true,
      files: movedFiles
    }
  } catch (error) {
    log.info('Error copy files:', error)
    throw error
  }
}

export const moveVideoFileToFolder = async (filePath, destinationFolder) => {
  try {
    // Ensure the destination folder exists
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true })
    }

    const fileExtension = extname(filePath)
    const destinationPath = join(destinationFolder, `record${fileExtension}`)

    await fs.promises.copyFile(filePath, destinationPath)

    return {
      result: true,
      path: destinationPath
    }
  } catch (error) {
    log.info('Error moving video file:', error)
    throw error
  }
}

ipcMain.handle('file:openFolder', (event, type, folderPath) => {
  if (type === 'custom' && folderPath) {
    // Use spawn to open the image with the default viewer
    spawn('explorer', [folderPath])
  }
  if (type === 'log') {
    const logFolder = app.getPath('logs')
    spawn('explorer', [logFolder])
  }
  if (type === 'temp') {
    const tempDir = os.tmpdir()
    const appFolder = join(tempDir, app.getName())
    spawn('explorer', [appFolder])
  }
})

ipcMain.handle('file:testConvert', () => {
  console.log('wert')
  return new Promise((resolve) => {
    const data = getDataConfig()
    const filePath = join(data.directory, '/test/test3.webm')
    const fileMp4Path = `${data.directory}/test3.mp4`
    const fileWebmPath = `${data.directory}/test3.webm`

    console.log(filePath, fileMp4Path)
    const command = `${ffmpegPath} -i "${filePath}" -c:v copy -c:a copy -map_metadata 0 "${fileWebmPath}"`

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
  })
})
