import { ipcMain } from 'electron'
import db from '../config/database'
import { comparePassword, hashPassword } from '../config/password'
import { getAccessToken, verifyToken } from '../config/token'
import { log } from '../config/log'

export const login = async ({ username, password }) => {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?')
  const result = stmt.get(username?.toLowerCase())

  if (!result) {
    return {
      result: false,
      message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна.'
    }
  }

  const { password: userPassword, ...other } = result
  const isMatch = await comparePassword(userPassword, password)
  if (!isMatch) {
    return {
      result: false,
      message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна.'
    }
  }

  const token = getAccessToken(other)
  return {
    result: true,
    data: {
      user: other,
      token
    }
  }
}

export const checkToken = (token) => {
  if (!token) {
    return {
      result: true,
      data: {
        isLogged: false
      }
    }
  }
  try {
    const res = verifyToken(token)
    return {
      result: true,
      data: {
        isLogged: true,
        ...res
      }
    }
  } catch (err) {
    return {
      result: true,
      data: {
        isLogged: false
      }
    }
  }
}

export const registerAndLogin = async (data) => {
  try {
    const res = await registerUser(data)

    if (!res.result) {
      return res
    }

    const loginResult = await login({
      username: data.username,
      password: data.password
    })

    return loginResult
  } catch (err) {
    log.info('Register with login ERROR:::START ')
    if (err instanceof Error) {
      log.info(err.message)
      log.info(err.stack)
    }
    log.info('Register with login ERROR:::END ')
    return {
      result: false,
      message: 'Бүртгэл үүсгэхэд алдаа гарлаа.'
    }
  }
}

export const registerUser = async ({ password, isRoot, username, ...other }) => {
  try {
    const stmt1 = db.prepare('SELECT * FROM users WHERE username = ?')
    const result = stmt1.get(username?.toLowerCase())

    if (result) {
      return {
        result: false,
        message: 'Нэвтрэх нэр бүртгэлтэй байна.'
      }
    }

    const stmt = db.prepare(
      'INSERT INTO users (username, displayName, role, password, position, type, createdAt) VALUES (@username, @displayName, @role, @password, @position, @type, @createdAt)'
    )
    const hp = await hashPassword(password)
    const userData = {
      ...other,
      username: username?.toLowerCase(),
      type: isRoot ? 'root' : 'normal',
      createdAt: new Date().toISOString()
    }
    stmt.run({
      ...userData,
      password: hp
    })

    return {
      result: true,
      data: userData
    }
  } catch (err) {
    log.info('REGISTER ERROR:::START ')
    if (err instanceof Error) {
      log.info(err.message)
      log.info(err.stack)
    }
    log.info('REGISTER ERROR:::END ')
    return {
      result: false,
      message: 'Бүртгэл үүсгэхэд алдаа гарлаа.'
    }
  }
}

ipcMain.handle('auth:checkToken', (event, token) => {
  const result = checkToken(token) // Call the checkToken function
  return result // Return validation result to the renderer
})

ipcMain.handle('auth:login', (event, data) => {
  const result = login(data) // Call the checkToken function
  return result // Return validation result to the renderer
})

ipcMain.handle('auth:registerAndLogin', (event, data) => {
  const result = registerAndLogin(data) // Call the checkToken function
  return result // Return validation result to the renderer
})

ipcMain.handle('auth:registerUser', (event, data) => {
  const result = registerUser(data) // Call the checkToken function
  return result // Return validation result to the renderer
})
