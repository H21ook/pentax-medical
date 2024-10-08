import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getAllUsers, getRootUser } from '../config/user'
import { checkToken, login, registerAndLogin, registerUser } from '../config/auth'

// Custom APIs for renderer
const api = {
  getAllUsers: getAllUsers,
  getRootUser: getRootUser,
  checkToken: checkToken,
  login: login,
  registerAndLogin: registerAndLogin,
  registerUser: registerUser
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
