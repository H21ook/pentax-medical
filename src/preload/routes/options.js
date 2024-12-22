import { ipcRenderer } from 'electron'

export const getAllOptions = async () => {
  return await ipcRenderer.invoke('options:getAllOptions')
}

export const deleteOptions = (data) => {
  return ipcRenderer.invoke('options:deleteOptions', data)
}

export const updateOptions = (data) => {
  return ipcRenderer.invoke('options:updateOptions', data)
}

export const createOptions = (data) => {
  return ipcRenderer.invoke('options:createOptions', data)
}
