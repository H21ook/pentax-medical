import { ipcRenderer } from 'electron'

export const getAllUsers = () => {
  return ipcRenderer.invoke('user:getAllUsers')
}

export const getProfile = (token) => {
  return ipcRenderer.invoke('user:getProfile', token)
}

export const updateProfile = (data, token) => {
  return ipcRenderer.invoke('user:updateProfile', {
    data,
    token
  })
}
