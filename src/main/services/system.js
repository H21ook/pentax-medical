import { ipcMain } from 'electron'
import db from '../config/database'
import { log } from '../config/log'
import { verifyToken } from '../config/token'

export const getDataConfig = () => {
  const tableName = 'data_config'
  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
    .get(tableName)

  if (tableExists) {
    const stmt1 = db.prepare('SELECT * FROM data_config WHERE id = @id')
    return stmt1.get({
      id: 1
    })
  } else {
    log.info(`Table '${tableName}' does not exist. Skipping select query.`)
    return undefined
  }
}

ipcMain.handle('system:saveDataDirectory', (_, { data, token }) => {
  try {
    const user = verifyToken(token)

    if (user.systemRole === 'worker') {
      return {
        result: false,
        message: 'Таны эрх хүрэхгүй байна.'
      }
    }

    const configData = getDataConfig()

    const stmt = db.prepare(
      'UPDATE data_config SET directory = @directory, device = @device, status = @status, updatedAt = @updatedAt, updatedUserId = @updatedUserId WHERE id = @id'
    )

    stmt.run({
      directory: data?.path,
      device: data?.device,
      status: 'runing',
      updatedAt: new Date().toISOString(),
      updatedUserId: user.id,
      id: configData.id
    })

    return {
      result: true,
      data: {
        status: 'udpated'
      }
    }
  } catch (err) {
    log.info('DATA DIRECTORY ERROR::: ')
    if (err instanceof Error) {
      log.info(err.message)
      log.info(err.stack)
    }
    return {
      result: false,
      message: 'Алдаа гарлаа.'
    }
  }
})

ipcMain.handle('system:getDataConfig', () => {
  return getDataConfig()
})
