import { ipcMain } from 'electron'
import db from '../config/database'
import { log } from '../config/log'

export const addAddress = (data) => {
  try {
    let response
    if (data.type === 'city') {
      const stmt = db.prepare(
        'INSERT INTO address (name, isParent, createdAt) VALUES (@name, @isParent, @createdAt)'
      )
      let newData = {
        name: data.cityName,
        isParent: 1,
        createdAt: new Date().toISOString()
      }
      response = stmt.run(newData)
    } else {
      const stmt = db.prepare(
        'INSERT INTO address (name, parentId, isParent, createdAt) VALUES (@name, @parentId, @isParent, @createdAt)'
      )
      response = stmt.run({
        name: data.districtName,
        parentId: data.parentId,
        isParent: 0,
        createdAt: new Date().toISOString()
      })
    }
    const stmt2 = db.prepare('SELECT * FROM address WHERE id = ?')
    const address = stmt2.get(response.lastInsertRowid)
    return {
      result: true,
      data: address
    }
  } catch (err) {
    log.info('Insert address error:::')
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

export const deleteAddress = (id) => {
  try {
    const stmt = db.prepare('DELETE FROM address WHERE id = ?')
    stmt.run(id)
    return {
      result: true
    }
  } catch (err) {
    log.info('Delete address error:::')
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

export const getAllAddress = () => {
  const stmt = db.prepare('SELECT * FROM address ORDER BY name DESC')
  return stmt.all()
}

ipcMain.handle('address:saveAddress', (_, data) => {
  return addAddress(data)
})

ipcMain.handle('address:deleteAddress', (_, id) => {
  return deleteAddress(id)
})

ipcMain.handle('address:getAllAddress', () => {
  return getAllAddress()
})
