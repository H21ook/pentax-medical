import { ipcRenderer } from 'electron'

export const getVideoDeviceList = (blob) => {
  return ipcRenderer.invoke('file:getVideoDevices', blob)
}

export const saveVideoFile = (blob, uuid) => {
  return ipcRenderer.invoke('file:saveVideoFile', { buffer: blob, uuid })
}

export const saveImageFile = (dataUrl, uuid) => {
  return ipcRenderer.invoke('file:saveImage', { imageData: dataUrl, uuid })
}

export const removeTempFiles = (uuid) => {
  return ipcRenderer.invoke('file:removeTempFiles', uuid)
}
