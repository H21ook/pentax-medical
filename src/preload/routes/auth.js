import { ipcRenderer } from 'electron'

export const login = async (data) => {
  return await ipcRenderer.invoke('auth:login', data)
}
export const checkToken = async (token) => {
  return await ipcRenderer.invoke('auth:checkToken', token)
}
export const registerAndLogin = async (data) => {
  return await ipcRenderer.invoke('auth:registerAndLogin', data)
}
export const registerUser = async (data) => {
  return await ipcRenderer.invoke('auth:registerUser', data)
}
