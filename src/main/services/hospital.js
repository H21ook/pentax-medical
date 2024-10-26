import { ipcMain } from 'electron'
import { log } from '../config/log'
import db from '../config/database'
import { verifyToken } from '../config/token'

const create = (data, token) => {
  try {
    const user = verifyToken(token)
    const nowDate = new Date().toISOString()

    const insertHospital = db.prepare(`INSERT INTO
        hospital (name, tasagName, address, phoneNumber, createdAt, createdUserId, updatedAt, updatedUserId)
      VALUES
          (@name, @tasagName, @address, @phoneNumber, @createdAt, @createdUserId, @updatedAt, @updatedUserId);`)

    insertHospital.run({
      ...data,
      createdAt: nowDate,
      createdUserId: user.id,
      updatedAt: nowDate,
      updatedUserId: user.id
    })

    return getHospitalData()
  } catch (err) {
    log.info('Create hospital error:::')
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

const update = (data, token) => {
  try {
    const user = verifyToken(token)
    const nowDate = new Date().toISOString()

    const oldData = getHospitalData()

    const insertHospital = db.prepare(`UPDATE
        hospital SET name = @name, tasagName = @tasagName, address = @address, phoneNumber = @phoneNumber, updatedAt = @updatedAt, updatedUserId = @updatedUserId WHERE id = @id`)

    insertHospital.run({
      ...data,
      updatedAt: nowDate,
      updatedUserId: user.id,
      id: oldData.id
    })

    return getHospitalData()
  } catch (err) {
    log.info('Update hospital error:::')
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

const getHospitalData = () => {
  const stmt = db.prepare('SELECT * FROM hospital')
  const hospitalData = stmt.all()

  if (hospitalData && hospitalData?.length > 0) {
    return {
      result: true,
      data: hospitalData[0]
    }
  }

  return {
    result: false,
    message: 'Өгөгдөл олдсонгүй'
  }
}

ipcMain.handle('hospital:createHospital', (_, { data, token }) => {
  return create(data, token)
})

ipcMain.handle('hospital:updateHospital', (_, { data, token }) => {
  return update(data, token)
})

ipcMain.handle('hospital:getHospitalData', () => {
  return getHospitalData()
})
