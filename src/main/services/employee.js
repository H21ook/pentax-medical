import { ipcMain } from 'electron'
import db from '../config/database'
import { join, dirname } from 'path'
import fs from 'fs'
import { verifyToken } from '../config/token'
import { getTodayName, log } from '../config/log'
import {
  createTempFolder,
  getDataDirectory,
  moveFilesToFolder,
  moveImagesToFolder,
  moveVideoFileToFolder
} from './file'

const prepareFolder = async (uuid) => {
  const rootPath = await getDataDirectory()
  const today = getTodayName()
  const todayFolderPath = join(rootPath, today)

  if (!fs.existsSync(todayFolderPath)) {
    // Create the folder if it doesn't exist
    fs.mkdirSync(todayFolderPath, { recursive: true })
    log.info(`Created day folder: ${todayFolderPath}`)
  } else {
    log.info(`Day Folder already exists: ${todayFolderPath}`)
  }

  const userFolder = join(todayFolderPath, uuid)

  if (!fs.existsSync(userFolder)) {
    // Create the folder if it doesn't exist
    fs.mkdirSync(userFolder, { recursive: true })
    log.info(`Created user folder: ${userFolder}`)
  } else {
    log.info(`User folder already exists: ${todayFolderPath}`)
  }

  return userFolder
}

// const createEmployeeImages = async ({ employeeId, uuid, images, tempImages }) => {
//   const insert = db.prepare(`
//         INSERT INTO employeeImages (
//             uuid, employeeId, name, path, orderIndex, position, type, createdDate
//         ) VALUES (
//             @uuid, @employeeId, @name, @path, @orderIndex, @position, @type, @createdDate
//         )
//     `)
//   const distFolder = await prepareFolder(uuid)
//   const sourceFolder = createTempFolder(uuid)

//   const rawImages = await moveImagesToFolder(images, distFolder)

//   if (rawImages?.result) {
//     const allImages = rawImages.files.map((item) => {
//       return {
//         ...item,
//         type: 'raw'
//       }
//     })
//     allImages.map((imageData) => {
//       const info = insert.run({
//         // uuid: uuid,
//         employeeId: employeeId,
//         name: imageData.name,
//         path: imageData.path,
//         orderIndex: imageData?.orderIndex,
//         position: imageData?.position,
//         type: imageData?.type,
//         createdDate: new Date().toISOString()
//       })

//       return info.lastInsertRowid
//     })
//   }
//   log.info('Raw images saved ')
//   const imageWithFiles = tempImages?.filter((item) => item?.path)
//   log.info('Image path data ', imageWithFiles)
//   const res = await moveFilesToFolder(imageWithFiles, distFolder, sourceFolder)
//   if (res.result) {
//     let allImages = res.files.map((item) => {
//       return {
//         ...item,
//         type: 'selected'
//       }
//     })
//     allImages.map((imageData) => {
//       const info = insert.run({
//         uuid: uuid,
//         employeeId: employeeId,
//         name: imageData.name,
//         path: imageData.path,
//         orderIndex: imageData?.orderIndex,
//         position: imageData?.position,
//         type: imageData?.type,
//         createdDate: new Date().toISOString()
//       })

//       return info.lastInsertRowid
//     })
//     log.info('Selected images saved ')
//   }
// }

const createEmployee = async (employee, images, tempImages, token) => {
  try {
    const user = verifyToken(token)
    const uuid = employee?.uuid
    const distFolder = await prepareFolder(employee.uuid)
    const res = await moveVideoFileToFolder(employee.videoPath, distFolder)
    const sourceFolder = createTempFolder(uuid)

    // raw images
    const rawImages = await moveImagesToFolder(images, distFolder)
    // reportImages
    const imageWithFiles = tempImages?.filter((item) => item?.path)
    log.info('Image path data ', imageWithFiles)
    const reportImages = await moveFilesToFolder(imageWithFiles, distFolder, sourceFolder)

    if (res.result) {
      const transaction = db.transaction(() => {
        // Example query 1: Insert into table1
        const insert = db.prepare(`
            INSERT INTO employee (
                uuid, hospitalName, departmentName, date, diseaseIndication, anesthesia,
                firstName, lastName, gender, cityId, districtId, regNo, age, phoneNumber,
                address, videoPath, type, diagnosis, summary, doctorId, nurseId, sourceType, scopeType, procedure, folderPath, createdAt, createdUserId, updatedAt, updatedUserId
            ) VALUES (
                @uuid, @hospitalName, @departmentName, @date, @diseaseIndication, @anesthesia,
                @firstName, @lastName, @gender, @cityId, @districtId, @regNo, @age, @phoneNumber,
                @address, @videoPath, @type, @diagnosis, @summary, @doctorId, @nurseId, @sourceType, @scopeType, @procedure, @folderPath, @createdAt, @createdUserId, @updatedAt, @updatedUserId
            )
        `)
        const nowDate = new Date().toISOString()
        const info = insert.run({
          ...employee,
          folderPath: distFolder,
          videoPath: res.path,
          createdAt: nowDate,
          createdUserId: user.id,
          updatedAt: nowDate,
          updatedUserId: user.id
        })
        const newEmployeeId = info.lastInsertRowid

        // Save images
        const imagesQuery = db.prepare(`
            INSERT INTO employeeImages (
                uuid, employeeId, name, path, orderIndex, position, type, createdDate
            ) VALUES (
                @uuid, @employeeId, @name, @path, @orderIndex, @position, @type, @createdDate
            )
        `)

        if (rawImages?.result) {
          const allImages = rawImages.files.map((item) => {
            return {
              ...item,
              type: 'raw'
            }
          })
          allImages.forEach((imageData) => {
            const info = imagesQuery.run({
              uuid: uuid,
              employeeId: newEmployeeId,
              name: imageData.name,
              path: imageData.path,
              orderIndex: imageData?.orderIndex,
              position: imageData?.position,
              type: imageData?.type,
              createdDate: new Date().toISOString()
            })

            return info.lastInsertRowid
          })
        }
        log.info('Raw images saved ')

        if (reportImages.result) {
          let allImages = reportImages.files.map((item) => {
            return {
              ...item,
              type: 'selected'
            }
          })
          allImages.forEach((imageData) => {
            const info = imagesQuery.run({
              uuid: uuid,
              employeeId: newEmployeeId,
              name: imageData.name,
              path: imageData.path,
              orderIndex: imageData?.orderIndex,
              position: imageData?.position,
              type: imageData?.type,
              createdDate: new Date().toISOString()
            })

            return info.lastInsertRowid
          })
          log.info('Selected images saved ')
        }
      })

      await transaction() // Commit the transaction
      console.log('Transaction completed successfully.', employee?.uuid)
      // Execute the transaction
      return {
        result: true
      }
    }
    return {
      result: false
    }
  } catch (err) {
    log.info('Create employee error:::')
    if (err instanceof Error) {
      log.info(err.message)
      log.info(err.stack)
    }
    return {
      result: false,
      message: 'Алдаа гарлаа'
    }
  }
}

const fileDelete = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        log.info('Error deleting the file:', err)
        reject(err)
      } else {
        log.info('File deleted successfully:', path)
        resolve(true)
      }
    })
  })
}

function copyAndRenameImage(currentFilePath, newFileName) {
  return new Promise((resolve, reject) => {
    const currentDir = dirname(currentFilePath)

    // Construct the destination path with the new file name
    const destinationPath = join(currentDir, newFileName)

    // Check if the source file exists
    fs.access(currentFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        log.info('Source file does not exist:', currentFilePath)
        return reject(err)
      }

      // Copy and rename the file
      fs.copyFile(currentFilePath, destinationPath, (err) => {
        if (err) {
          log.info('Error copying the file:', err)
          return reject(err)
        } else {
          log.info(
            `File copied and renamed successfully:\nFrom: ${currentFilePath}\nTo: ${destinationPath}`
          )
          return resolve(destinationPath)
        }
      })
    })
  })
}

const updateEmployeeImages = async (images) => {
  try {
    const deleteImages = images?.filter((it) => it.imageChanged)
    if (deleteImages?.length > 0) {
      const placeholders = deleteImages.map(() => '?').join(',')
      const query = `SELECT * FROM employeeImages WHERE id IN (${placeholders})`
      const stmt = db.prepare(query)
      const oldImages = stmt.all(...deleteImages.map((item) => item.id))

      // huuchin zurguudiig ustgaw
      const deleteRequests = oldImages.map((img) => {
        return fileDelete(img.path)
      })

      await Promise.all(deleteRequests)
    }
    //shine zurag copy hiine
    const imageChanges = images.map(async (img) => {
      if (!img.path) {
        return { ...img, path: '' }
      }
      const newPath = await copyAndRenameImage(
        img.path,
        `${img.name.replaceAll(' ', '_')}_${img.orderIndex - 1}.png`
      )
      return {
        ...img,
        path: newPath
      }
    })

    const newImages = await Promise.all(imageChanges)

    newImages?.map((it) => {
      const udpateEmployee = db.prepare(`UPDATE
        employeeImages SET path = @path, name = @name, position = @position WHERE id = @id`)

      udpateEmployee.run(it)
    })

    return {
      result: true
    }
  } catch (err) {
    log.info('Update employee images error:::')
    if (err instanceof Error) {
      log.info(err.message)
      log.info(err.stack)
    }
    return {
      result: false,
      message: 'Алдаа гарлаа'
    }
  }
}

const updateEmployee = async ({ id, summary, images }) => {
  try {
    const nowDate = new Date().toISOString()
    const udpateEmployee = db.prepare(`UPDATE
        employee SET summary = @summary, updatedAt = @updatedAt WHERE id = @id`)

    udpateEmployee.run({
      summary,
      updatedAt: nowDate,
      id
    })

    if (images?.length > 0) {
      await updateEmployeeImages(images)
    }

    return {
      result: true
    }
  } catch (err) {
    log.info('Update employee error:::')
    if (err instanceof Error) {
      log.info(err.message)
      log.info(err.stack)
    }
    return {
      result: false,
      message: 'Алдаа гарлаа'
    }
  }
}

const getEmployeeList = () => {
  const query = db.prepare(`
        SELECT * FROM employee
        ORDER BY createdAt DESC
    `)

  const employees = query.all() // Get all employees sorted by createdDate
  return employees
}

const getEmployeeImagesList = () => {
  const query = db.prepare(`
        SELECT * FROM employeeImages
        ORDER BY createdAt DESC
    `)

  const employees = query.all() // Get all employees sorted by createdDate
  return employees
}

const getEmployee = (id) => {
  const query = db.prepare(`
        SELECT * FROM employee where id = @id
    `)

  const employee = query.get({
    id
  })

  if (!employee) {
    return undefined
  }

  const query2 = db.prepare(`
        SELECT * FROM employeeImages WHERE employeeId = @employeeId
    `)

  const images = query2.all({
    employeeId: id
  })

  return {
    ...employee,
    images: images
  }
}

const deleteEmployee = (id) => {
  try {
    db.exec(`DELETE from employeeImages WHERE employeeId = ${id}`)
    db.exec(`DELETE from employee WHERE id = ${id}`)
    return {
      result: true
    }
  } catch (err) {
    log.info('delete employee error:::')
    if (err instanceof Error) {
      log.info(err.message)
      log.info(err.stack)
    }
    return {
      result: false,
      message: 'Алдаа гарлаа'
    }
  }
}

ipcMain.handle('employee:create', (_, { data, images, tempImages, token }) => {
  return createEmployee(data, images, tempImages, token)
})

ipcMain.handle('employee:employeeList', () => {
  return getEmployeeList()
})

ipcMain.handle('employee:employeeImages', () => {
  return getEmployeeImagesList()
})

ipcMain.handle('employee:getEmployee', (_, id) => {
  return getEmployee(id)
})

ipcMain.handle('employee:update', (_, data) => {
  return updateEmployee(data)
})

ipcMain.handle('employee:delete', (_, id) => {
  return deleteEmployee(id)
})
