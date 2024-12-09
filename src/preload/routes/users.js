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

export const updateUser = (data, token) => {
  return ipcRenderer.invoke('user:updateUser', {
    data,
    token
  })
}

export const changePassword = (data, token) => {
  return ipcRenderer.invoke('user:changePassword', {
    data,
    token
  })
}

export const changeUserPassword = (data, token) => {
  return ipcRenderer.invoke('user:changeUserPassword', {
    data,
    token
  })
}

export const blockUser = (data, token) => {
  return ipcRenderer.invoke('user:blockUser', {
    data,
    token
  })
}
