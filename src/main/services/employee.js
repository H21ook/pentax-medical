import { ipcMain } from 'electron'
import db from '../config/database'
import { join, extname, basename } from 'path'
import fs from 'fs'
import { verifyToken } from '../config/token'
import { getTodayName, log } from '../config/log'
import {
  createTempFolder,
  getDataDirectory,
  getTempFolder,
  moveFilesToFolder,
  moveImagesToFolder,
  moveVideoFileToFolder
} from './file'

const prepareFolder = async (uuid) => {
  const rootPath = await getDataDirectory()
  const today = getTodayName()
  const todayFolderPath = join(rootPath, today)

  try {
    await fs.promises.access(todayFolderPath, fs.constants.F_OK)
    log.info(`Day Folder already exists: ${todayFolderPath}`)
  } catch (error) {
    await fs.promises.mkdir(todayFolderPath, { recursive: true })
    log.info(`Created day folder: ${todayFolderPath}`)
  }

  const userFolder = join(todayFolderPath, uuid)

  try {
    await fs.promises.access(userFolder, fs.constants.F_OK)
    log.info(`User folder already exists: ${userFolder}`)
  } catch (error) {
    await fs.promises.mkdir(userFolder, { recursive: true })
    log.info(`Created user folder: ${userFolder}`)
  }

  return userFolder
}

const isImageFile = (fileName) => {
  const ext = extname(fileName).toLowerCase()
  return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'].includes(ext)
}

const readFolderFiles = async (folderPath) => {
  if (!folderPath || !fs.existsSync(folderPath)) {
    return []
  }

  const entries = await fs.promises.readdir(folderPath, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry, index) => ({
      id: `${basename(folderPath)}-${index}`,
      name: entry.name,
      path: join(folderPath, entry.name),
      fileName: entry.name
    }))
}

const normalizeRawFiles = (files = []) => {
  return files
    .filter((item) => /^raw[-_ ]?/i.test(item.name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
}

const normalizeSelectedFiles = (files = []) => {
  return files
    .filter((item) => !/^raw[-_ ]?/i.test(item.name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
}

const parseTrailingIndex = (fileName) => {
  const match = fileName.match(/(\d+)(?=\.[^.]+$)/)
  if (!match) {
    return null
  }

  const parsed = Number.parseInt(match[1], 10)
  return Number.isNaN(parsed) ? null : parsed
}

const resolveImageIndex = (fileName, fallbackIndex) => {
  const parsedIndex = parseTrailingIndex(fileName)
  return parsedIndex !== null ? parsedIndex + 1 : fallbackIndex + 1
}

const resolveImageName = (filePath, fallbackName) => {
  if (!filePath) {
    return fallbackName
  }

  const fileName = basename(filePath)
  return fileName || fallbackName
}

const normalizeAllImages = (files = []) => {
  return files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
}

const getEmployeeRecoveryState = async (employee) => {
  const permanentFiles = await readFolderFiles(employee?.path || employee?.folderPath)
  const tempFiles = await readFolderFiles(getTempFolder(employee?.uuid))

  const permanentSelectedFiles = normalizeSelectedFiles(permanentFiles)
  const permanentRawFiles = normalizeRawFiles(permanentFiles)
  const tempImages = normalizeAllImages(tempFiles)

  const dbSelectedCount = employee?.images?.filter((item) => item.type === 'selected')?.length || 0
  const dbRawCount = employee?.images?.filter((item) => item.type === 'raw')?.length || 0

  const needsRecovery =
    (permanentSelectedFiles.length > 0 && dbSelectedCount < permanentSelectedFiles.length) ||
    (tempImages.length > 0 && dbRawCount < tempImages.length)

  return {
    needsRecovery,
    permanentSelectedCount: permanentSelectedFiles.length,
    permanentRawCount: permanentRawFiles.length,
    tempRawCount: tempImages.length
  }
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
      log.info('Transaction completed successfully.', employee?.uuid)
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

function copyAndRenameImage(currentFilePath, destinationFolder, newFileName) {
  return new Promise((resolve, reject) => {
    if (!destinationFolder) {
      return reject(new Error('Destination folder is required'))
    }

    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true })
    }

    const destinationPath = join(destinationFolder, newFileName)

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

const updateEmployeeImages = async (images, destinationFolder, employee) => {
  const filesToDeleteAfterSuccess = []
  const filesCreatedToCleanupOnError = []

  try {
    // ---- УСТГАХ ГЭЖ БУЙ ЗУРГУУДЫН МЭДЭЭЛЛИЙГ САНГААС УНШИХ ----
    const deleteImages = images?.filter((it) => it.deleted && it.id) || []
    let oldImageFiles = []

    if (deleteImages.length > 0) {
      const placeholders = deleteImages.map(() => '?').join(',')
      const query = `SELECT path FROM employeeImages WHERE id IN (${placeholders})`
      const stmt = db.prepare(query)
      const rows = stmt.all(...deleteImages.map((item) => item.id))
      oldImageFiles = rows.map((row) => row.path).filter(Boolean)
    }

    // ---- ШИНЭ ЗУРГУУДЫГ АСИНХРОНООР ДИСК РҮҮ ХУУЛАХ ----
    const activeImages = images.filter((img) => !img.deleted) || []

    const imageChanges = activeImages.map(async (img) => {
      if (!img.path) {
        return { ...img, path: '' }
      }
      // Хэрэв шинээр нэмэгдэж байгаа эсвэл өөрчлөгдсөн зураг бол (жишээ нь түр хавтсанд байгаа бол) хуулна
      // Хэрэв аль хэдийн хуулагдсан зураг бол хэвээр нь үлдээнэ

      const newPath = await copyAndRenameImage(
        img.path,
        destinationFolder,
        `${img.name.replaceAll(' ', '_')}_${img.orderIndex - 1}.png`
      )
      filesCreatedToCleanupOnError.push(newPath) // Алдаа гарвал цэвэрлэхийн тулд хадгална
      return { ...img, path: newPath }
    })

    const newImages = await Promise.all(imageChanges)

    // Өөрчлөгдөх гэж буй (UPDATE хийгдэх) зургуудын хуучин файлыг олох
    for (const it of newImages) {
      if (it.id != null) {
        const existing = db.prepare(`SELECT path FROM employeeImages WHERE id = ?`).get(it.id)
        if (existing?.path && existing.path !== it.path) {
          filesToDeleteAfterSuccess.push(existing.path)
        }
      }
    }

    // ---- ЦЭВЭР СИНХРОН ӨГӨГДЛИЙН САНГИЙН ТРАНЗАКЦ ----
    const runDatabaseUpdates = db.transaction((delImgs, newImgs) => {
      // А. Хуучин зургуудыг сангаас устгах
      if (delImgs.length > 0) {
        const deleteStmt = db.prepare(`DELETE FROM employeeImages WHERE id = ?`)
        delImgs.forEach((img) => deleteStmt.run(img.id))
      }

      // Б. Шинэ зургуудыг засах болон нэмэх бэлтгэл
      const insertEmployeeImage = db.prepare(`
        INSERT INTO employeeImages (uuid, employeeId, name, path, orderIndex, position, type, createdDate)
        VALUES (@uuid, @employeeId, @name, @path, @orderIndex, @position, @type, @createdDate)
      `)

      const updateEmployeeImage = db.prepare(`
        UPDATE employeeImages
        SET path = @path, name = @name, position = @position, orderIndex = @orderIndex, type = @type
        WHERE id = @id
      `)

      newImgs.forEach((it) => {
        const finalName = resolveImageName(it?.path, it?.name)
        if (it?.id != null) {
          // UPDATE үйлдэл
          updateEmployeeImage.run({
            ...it,
            name: finalName,
            type: 'selected'
          })
        } else {
          // INSERT үйлдэл
          insertEmployeeImage.run({
            uuid: employee?.uuid,
            employeeId: employee?.id,
            name: finalName,
            path: it?.path,
            orderIndex: it?.orderIndex,
            position: it?.position,
            type: 'selected',
            createdDate: new Date().toISOString()
          })
        }
      })
    })

    // Transactions ажиллуулах
    runDatabaseUpdates(deleteImages, newImages)

    // А. Бүртгэл нь устсан зургуудын файлыг устгах
    // Б. Шинэ зургийн зам солигдсон бол хуучин файлыг устгах
    const allFilesToDelete = [...oldImageFiles, ...filesToDeleteAfterSuccess]

    allFilesToDelete.forEach((filePath) => {
      fileDelete(filePath).catch((err) => {
        log.info(`Error deleting file ${filePath}: ${err.message}`)
      })
    })

    return { result: true }
  } catch (err) {
    log.info('Update employee images error:::')
    if (err instanceof Error) {
      log.info(err.message)
      log.info(err.stack)
    }

    // Хэрэв өгөгдлийн сан дээр алдаа гарч унасан бол диск дээр шинээр үүсгэсэн зургуудыг цэвэрлэж устгана
    filesCreatedToCleanupOnError.forEach((filePath) => {
      fileDelete(filePath).catch(() => {})
    })

    return {
      result: false,
      message: 'Алдаа гарлаа'
    }
  }
}

const recoverEmployeeImages = async ({ id, uuid }) => {
  try {
    const employee = db
      .prepare(`SELECT * FROM employee WHERE id = @id AND uuid = @uuid`)
      .get({ id, uuid })

    if (!employee) {
      return {
        result: false,
        message: 'Өвчтөний мэдээлэл олдсонгүй'
      }
    }

    const folderPath = employee.folderPath
    const tempFolder = getTempFolder(uuid)

    const [permanentFiles, tempFiles] = await Promise.all([
      readFolderFiles(folderPath),
      readFolderFiles(tempFolder)
    ])

    const permanentSelectedFiles = normalizeSelectedFiles(permanentFiles)
    const permanentRawFiles = normalizeRawFiles(permanentFiles)
    const tempRawFiles = normalizeAllImages(tempFiles)

    if (permanentSelectedFiles.length === 0 && tempRawFiles.length === 0) {
      return {
        result: false,
        message: 'Файл олдсонгүй'
      }
    }

    const imagesQuery = db.prepare(`
      INSERT INTO employeeImages (
          uuid, employeeId, name, path, orderIndex, position, type, createdDate
      ) VALUES (
          @uuid, @employeeId, @name, @path, @orderIndex, @position, @type, @createdDate
      )
    `)

    const copiedRawFiles = []
    if (tempRawFiles.length > 0) {
      const rawCopyRequests = tempRawFiles.map((item, index) => {
        const normalizedIndex = resolveImageIndex(item.name, index)
        const stagedName = `raw-recovery-${index + 1}${extname(item.name)}`
        const stagedPath = join(folderPath, stagedName)
        const finalName = `raw-${index + 1}${extname(item.name)}`
        const finalPath = join(folderPath, finalName)

        return fs.promises.copyFile(item.path, stagedPath).then(() => ({
          sourcePath: item.path,
          stagedPath,
          finalPath,
          finalName,
          type: 'raw',
          orderIndex: normalizedIndex,
          position: normalizedIndex
        }))
      })

      const stagedRawFiles = await Promise.all(rawCopyRequests)

      if (permanentRawFiles.length > 0) {
        await Promise.all(permanentRawFiles.map((img) => fileDelete(img.path).catch(() => null)))
      }

      await Promise.all(
        stagedRawFiles.map((item) =>
          fs.promises.rename(item.stagedPath, item.finalPath).then(() => {
            copiedRawFiles.push({
              name: item.finalName,
              path: item.finalPath,
              type: 'raw',
              orderIndex: item.orderIndex,
              position: item.position
            })
          })
        )
      )
    } else if (permanentRawFiles.length > 0) {
      copiedRawFiles.push(
        ...permanentRawFiles.map((item, index) => {
          const normalizedIndex = resolveImageIndex(item.name, index)
          return {
            ...item,
            type: 'raw',
            orderIndex: normalizedIndex,
            position: normalizedIndex
          }
        })
      )
    }

    const copiedSelectedFiles = permanentSelectedFiles.map((item, index) => {
      const normalizedIndex = resolveImageIndex(item.name, index)

      return {
        ...item,
        type: 'selected',
        orderIndex: normalizedIndex,
        position: normalizedIndex
      }
    })

    const transaction = db.transaction(() => {
      db.prepare(`DELETE FROM employeeImages WHERE employeeId = @employeeId`).run({
        employeeId: employee.id
      })

      copiedRawFiles.forEach((imageData, index) => {
        imagesQuery.run({
          uuid,
          employeeId: employee.id,
          name: imageData.name,
          path: imageData.path,
          orderIndex: imageData.orderIndex ?? index + 1,
          position: imageData.position ?? index + 1,
          type: 'raw',
          createdDate: new Date().toISOString()
        })
      })

      copiedSelectedFiles.forEach((imageData, index) => {
        imagesQuery.run({
          uuid,
          employeeId: employee.id,
          name: imageData.name,
          path: imageData.path,
          orderIndex: imageData.orderIndex ?? index + 1,
          position: imageData.position ?? index + 1,
          type: 'selected',
          createdDate: new Date().toISOString()
        })
      })
    })

    transaction()

    return {
      result: true
    }
  } catch (err) {
    log.info('Recover employee images error:::')
    if (err instanceof Error) {
      log.info(err.message)
      log.info(err.stack)
    }
    return {
      result: false,
      message: err instanceof Error && err.message ? err.message : 'Алдаа гарлаа'
    }
  }
}

const updateEmployee = async ({ id, summary, images }) => {
  try {
    const nowDate = new Date().toISOString()
    const employee = db.prepare(`SELECT * FROM employee WHERE id = @id`).get({ id })
    const updateEmployee = db.prepare(`UPDATE
        employee SET summary = @summary, updatedAt = @updatedAt WHERE id = @id`)

    updateEmployee.run({
      summary,
      updatedAt: nowDate,
      id
    })

    if (images?.length > 0) {
      await updateEmployeeImages(
        images.filter((img) => img?.edited),
        employee?.folderPath,
        employee
      )
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

const getEmployee = async (id) => {
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

  const recoveryState = await getEmployeeRecoveryState({
    ...employee,
    images
  })

  return {
    ...employee,
    images,
    recoveryState
  }
}

const deleteEmployee = async (id) => {
  try {
    const employee = db.prepare(`SELECT * FROM employee WHERE id = @id`).get({ id })
    if (!employee) {
      return {
        result: false,
        message: 'Ажилтан олдсонгүй'
      }
    }

    const images = db
      .prepare(`SELECT * FROM employeeImages WHERE employeeId = @employeeId`)
      .all({ employeeId: id })

    // Delete associated image files
    await Promise.all(
      images.map((img) =>
        fileDelete(img.path).catch((err) => {
          log.info('Error deleting image file for employee deletion::')
          if (err instanceof Error) {
            log.info(err.message)
            log.info(err.stack)
          }
        })
      )
    )

    // Delete video file if exists
    if (employee.videoPath) {
      await fileDelete(employee.videoPath).catch((err) => {
        log.info('Error deleting video file for employee deletion::')
        if (err instanceof Error) {
          log.info(err.message)
          log.info(err.stack)
        }
      })
    }

    // Delete the employee folder
    if (employee.folderPath && fs.existsSync(employee.folderPath)) {
      await fs.promises.rm(employee.folderPath, { recursive: true, force: true }).catch((err) => {
        log.info('Error deleting employee folder::')
        if (err instanceof Error) {
          log.info(err.message)
          log.info(err.stack)
        }
      })
    }

    db.prepare('DELETE FROM employeeImages WHERE employeeId = ?').run(id)
    db.prepare('DELETE FROM employee WHERE id = ?').run(id)
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

ipcMain.handle('employee:recoverImages', (_, data) => {
  return recoverEmployeeImages(data)
})

ipcMain.handle('employee:delete', (_, id) => {
  return deleteEmployee(id)
})
