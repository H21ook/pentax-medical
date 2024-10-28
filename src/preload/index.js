import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { checkToken, login, registerAndLogin, registerUser } from './routes/auth'
import { getAllUsers, getProfile, updateProfile } from './routes/users'
import { saveDataDirectory } from './routes/system'
import { createHospitalData, getHospitalData, updateHospitalData } from './routes/hospital'
import { deleteAddress, getAllAddress, saveAddress } from './routes/address'

// Custom APIs for renderer
const api = {
  // AUTH
  checkToken,
  login,
  registerAndLogin,
  registerUser,
  getProfile,
  updateProfile,
  // USERS
  getAllUsers,
  saveDataDirectory,
  // HOSPITAL
  createHospitalData,
  getHospitalData,
  updateHospitalData,
  // ADDRESS
  saveAddress,
  deleteAddress,
  getAllAddress
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
