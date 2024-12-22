import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { checkToken, login, registerAndLogin, registerUser } from './routes/auth'
import {
  blockUser,
  changePassword,
  changeUserPassword,
  getAllUsers,
  getProfile,
  updateProfile,
  updateUser
} from './routes/users'
import { saveDataDirectory } from './routes/system'
import { createHospitalData, getHospitalData, updateHospitalData } from './routes/hospital'
import { deleteAddress, getAllAddress, saveAddress } from './routes/address'
import {
  getVideoDeviceList,
  saveImageFile,
  saveVideoFile,
  removeTempFiles,
  removeImageFile,
  openFolder,
  print,
  testConvert,
  printPdf
} from './routes/file'
import { createEmployee, getEmployee, getEmployeeList } from './routes/employee'
import { getDataConfig } from './routes/dataConfig'
import { getAllOptions, updateOptions, deleteOptions, createOptions } from './routes/options'

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
  updateUser,
  saveDataDirectory,
  changePassword,
  changeUserPassword,
  blockUser,
  // HOSPITAL
  createHospitalData,
  getHospitalData,
  updateHospitalData,
  // ADDRESS
  saveAddress,
  deleteAddress,
  getAllAddress,

  //FILE
  saveVideoFile,
  getVideoDeviceList,
  saveImageFile,
  removeTempFiles,
  removeImageFile,
  openFolder,
  testConvert,

  //EMPLOYEE
  createEmployee,
  getEmployeeList,
  getEmployee,

  //DATA-CONFIG
  getDataConfig,
  printPdf,
  print,

  //OPTIONS
  getAllOptions,
  createOptions,
  updateOptions,
  deleteOptions
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
