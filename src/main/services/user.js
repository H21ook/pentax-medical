import { ipcMain } from 'electron'
import db from '../config/database'
import { log } from '../config/log'
import { verifyToken } from '../config/token'

export const getRootUser = () => {
  const stmt = db.prepare('SELECT username FROM users WHERE type = ?')
  const result = stmt.get('root')
  return result
}

export const getAllUsers = () => {
  const stmt = db.prepare(
    'SELECT id, username, systemRole, role, createdAt, position, displayName, type FROM users WHERE type != ?'
  )
  const users = stmt.all('system-root')
  return users
}

export const getUser = (userId) => {
  const stmt = db.prepare(
    'SELECT username, systemRole, role, createdAt, position, displayName, type FROM users WHERE id = ?'
  )
  return stmt.get(userId)
}

export const getProfile = (token) => {
  try {
    const user = verifyToken(token)
    const profile = getUser(user.id)
    return {
      result: true,
      data: profile
    }
  } catch (err) {
    log.info('Get profile error:::')
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

export const updateProfile = (data, token) => {
  try {
    const user = verifyToken(token)

    const stmt = db.prepare(
      'UPDATE users SET displayName = @displayName, position = @position WHERE id = @id'
    )
    stmt.run({
      ...data,
      id: user.id
    })

    return {
      result: true,
      data: getUser(user.id)
    }
  } catch (err) {
    log.info('Update profile error:::')
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

ipcMain.handle('user:getAllUsers', () => {
  const result = getAllUsers()
  return result
})

ipcMain.handle('user:getProfile', (_, token) => {
  return getProfile(token)
})

ipcMain.handle('user:updateProfile', (_, { data, token }) => {
  return updateProfile(data, token)
})
