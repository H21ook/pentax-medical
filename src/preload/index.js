import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import db from '../config/database'
import { hashPassword } from '../config/password'
import { getRootUser } from '../config/user'

// Custom APIs for renderer
const api = {
  getAllUsers: () => {
    const select = db.prepare('SELECT username FROM users')
    const users = select.all()
    return users
  },
  getRootUser: getRootUser,
  registerAndLogin: async ({ password, isRoot, ...other }) => {
    try {
      const stmt = db.prepare(
        'INSERT INTO users (username, displayName, role, password, type) VALUES (@username, @displayName, @role, @password, @type)'
      )
      const hp = await hashPassword(password)
      stmt.run({
        ...other,
        password: hp,
        type: isRoot ? 'root' : 'normal'
      })

      // login hiihiin
      return true
    } catch (err) {
      console.log('ERROR::: ', err)
    }
  },
  registerUser: async ({ password, isRoot, ...other }) => {
    try {
      const stmt = db.prepare(
        'INSERT INTO users (username, displayName, role, password, type) VALUES (@username, @displayName, @role, @password, @type)'
      )
      const hp = await hashPassword(password)
      stmt.run({
        ...other,
        password: hp,
        type: isRoot ? 'root' : 'normal'
      })
      return true
    } catch (err) {
      console.log('ERROR::: ', err)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
