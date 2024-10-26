import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { checkToken, login, registerAndLogin, registerUser } from './routes/auth'
import { getAllUsers } from './routes/users'
import { saveDataDirectory } from './routes/system'

// Custom APIs for renderer
const api = {
  // AUTH
  checkToken: checkToken,
  login: login,
  registerAndLogin: registerAndLogin,
  registerUser: registerUser,
  // USERS
  getAllUsers: getAllUsers,
  saveDataDirectory: saveDataDirectory
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
