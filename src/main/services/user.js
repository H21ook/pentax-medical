import { ipcMain } from 'electron'
import db from '../config/database'
import { log } from '../config/log'
import { verifyToken } from '../config/token'
import { comparePassword, hashPassword } from '../config/password'

export const getRootUser = () => {
  const stmt = db.prepare('SELECT username FROM users WHERE type = ?')
  const result = stmt.get('root')
  return result
}

export const getAllUsers = () => {
  const stmt = db.prepare(
    'SELECT id, username, systemRole, role, createdAt, position, displayName, type, isBlock FROM users WHERE type != ?'
  )
  const users = stmt.all('system-root')
  return users
}

export const getUser = (userId) => {
  const stmt = db.prepare(
    'SELECT id, isBlock, username, systemRole, role, createdAt, position, displayName, type FROM users WHERE id = ?'
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

export const updateUser = (data, token) => {
  try {
    const user = verifyToken(token)

    if (user.systemRole === 'worker') {
      return {
        result: false,
        message: 'Таны эрх хүрэхгүй байна'
      }
    }

    const stmt = db.prepare(
      'UPDATE users SET displayName = @displayName, position = @position, systemRole = @systemRole, role = @role WHERE id = @id'
    )
    stmt.run(data)

    return {
      result: true
    }
  } catch (err) {
    log.info('Update user profile error:::')
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

export const changePassword = async (data, token) => {
  try {
    const user = verifyToken(token)

    const stmt1 = db.prepare('SELECT * FROM users WHERE username = ?')
    const result = stmt1.get(user?.username?.toLowerCase())

    const isMatch = await comparePassword(result.password, data?.currentPassword)
    if (!isMatch) {
      return {
        result: false,
        message: 'Одоогийн нууц үг буруу байна.'
      }
    }

    const hp = await hashPassword(data?.newPassword)
    const stmt = db.prepare('UPDATE users SET password = @password WHERE id = @id')
    stmt.run({
      password: hp,
      id: user.id
    })

    return {
      result: true
    }
  } catch (err) {
    log.info('Change password error:::')
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

export const changeUserPassword = async (data, token) => {
  try {
    const user = verifyToken(token)

    if (user.systemRole === 'worker') {
      return {
        result: false,
        message: 'Таны эрх хүрэхгүй байна'
      }
    }

    const hp = await hashPassword(data?.password)
    const stmt = db.prepare('UPDATE users SET password = @password WHERE id = @id')
    stmt.run({
      password: hp,
      id: data?.userId
    })

    return {
      result: true
    }
  } catch (err) {
    log.info('Change password error:::')
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

export const blockUser = async ({ userId, isBlock }, token) => {
  try {
    const user = verifyToken(token)

    if (user.systemRole === 'worker') {
      return {
        result: false,
        message: 'Таны эрх хүрэхгүй байна'
      }
    }

    const stmt = db.prepare('UPDATE users SET isBlock = @isBlock WHERE id = @id')
    stmt.run({
      id: userId,
      isBlock: isBlock
    })

    return {
      result: true
    }
  } catch (err) {
    log.info('block user error:::')
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

ipcMain.handle('user:updateUser', (_, { data, token }) => {
  return updateUser(data, token)
})

ipcMain.handle('user:changePassword', (_, { data, token }) => {
  return changePassword(data, token)
})

ipcMain.handle('user:changeUserPassword', (_, { data, token }) => {
  return changeUserPassword(data, token)
})

ipcMain.handle('user:blockUser', (_, { data, token }) => {
  return blockUser(data, token)
})
