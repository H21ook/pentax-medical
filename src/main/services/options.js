import { ipcMain } from 'electron'
import db from '../config/database'
import { log } from '../config/log'

export const getAllOptions = () => {
  const stmt = db.prepare('SELECT * FROM optionsData')
  return stmt.all()
}

export const createOptions = ({ ...other }) => {
  try {
    const stmt = db.prepare(
      `INSERT INTO optionsData (name, value, type) VALUES (@name, @value, @type)`
    )

    stmt.run(other)
    return {
      result: true
    }
  } catch (err) {
    log.info('Create options error:::')
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

export const updateOptions = (data) => {
  try {
    const updatedOption = db.prepare(`UPDATE optionsData SET name = @name WHERE id = @id`)

    updatedOption.run({
      ...data
    })
    return {
      result: true
    }
  } catch (err) {
    log.info('UPDATE options error:::')
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

export const deleteOptions = (id) => {
  try {
    const stmt = db.prepare('DELETE FROM optionsData WHERE id = ?')
    stmt.run(id)
    return {
      result: true
    }
  } catch (err) {
    log.info('Delete options error:::')
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

ipcMain.handle('options:getAllOptions', () => {
  return getAllOptions()
})

ipcMain.handle('options:updateOptions', (_, data) => {
  return updateOptions(data)
})

ipcMain.handle('options:createOptions', (_, data) => {
  return createOptions(data)
})

ipcMain.handle('options:deleteOptions', (_, data) => {
  return deleteOptions(data)
})
