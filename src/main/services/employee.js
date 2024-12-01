import { ipcMain } from 'electron'
import db from '../config/database'
import { join } from 'path'
import fs from 'fs'
import { verifyToken } from '../config/token'
import { getTodayName, log } from '../config/log'
import {
  createTempFolder,
  getDataDirectory,
  moveFilesToFolder,
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

const createEmployeeImages = async ({ employeeId, uuid, images }) => {
  const insert = db.prepare(`
        INSERT INTO employeeImages (
            uuid, employeeId, name, path, orderIndex, createdDate
        ) VALUES (
            @uuid, @employeeId, @name, @path, @orderIndex, @createdDate
        )
    `)
  const distFolder = await prepareFolder(uuid)
  const sourceFolder = createTempFolder(uuid)
  const res = await moveFilesToFolder(images, distFolder, sourceFolder)
  if (res.result) {
    res.files.map((imageData) => {
      const info = insert.run({
        uuid: uuid,
        employeeId: employeeId,
        name: imageData.name,
        path: imageData.path,
        orderIndex: imageData.orderIndex,
        createdDate: new Date().toISOString()
      })

      return info.lastInsertRowid
    })
  }
}

const createEmployee = async (employee, images, token) => {
  try {
    const user = verifyToken(token)

    const distFolder = await prepareFolder(employee.uuid)
    const res = await moveVideoFileToFolder(employee.videoPath, distFolder)

    if (res.result) {
      const insert = db.prepare(`
        INSERT INTO employee (
            uuid, hospitalName, departmentName, date, patientCondition, diseaseIndication, anesthesia,
            firstName, lastName, birthDate, gender, cityId, districtId, regNo, age, phoneNumber,
            profession, address, videoPath, type, diagnosis, summary, doctorId, nurseId, sourceType, folderPath, createdAt, createdUserId, updatedAt, updatedUserId
        ) VALUES (
            @uuid, @hospitalName, @departmentName, @date, @patientCondition, @diseaseIndication, @anesthesia,
            @firstName, @lastName, @birthDate, @gender, @cityId, @districtId, @regNo, @age, @phoneNumber,
            @profession, @address, @videoPath, @type, @diagnosis, @summary, @doctorId, @nurseId, @sourceType, @folderPath, @createdAt, @createdUserId, @updatedAt, @updatedUserId
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

      createEmployeeImages({
        employeeId: newEmployeeId,
        uuid: employee.uuid,
        images
      })

      return {
        result: true,
        message: true
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

ipcMain.handle('employee:create', (_, { data, images, token }) => {
  return createEmployee(data, images, token)
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
