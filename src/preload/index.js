import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import db from '../config/database'

// Custom APIs for renderer
const api = {
  getAllUsers: () => {
    const select = db.prepare('SELECT username FROM users')
    const users = select.all()
    return users
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
