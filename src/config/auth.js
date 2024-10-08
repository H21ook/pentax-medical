import db from './database'
import { comparePassword, hashPassword } from './password'
import { getAccessToken, verifyToken } from './token'

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
    console.log('Register with login ERROR::: ', err)
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
      'INSERT INTO users (username, displayName, role, password, type) VALUES (@username, @displayName, @role, @password, @type)'
    )
    const hp = await hashPassword(password)
    const userData = {
      ...other,
      username: username?.toLowerCase(),
      type: isRoot ? 'root' : 'normal'
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
    console.log('REGISTER ERROR::: ', err)
    return {
      result: false,
      message: 'Бүртгэл үүсгэхэд алдаа гарлаа.'
    }
  }
}
