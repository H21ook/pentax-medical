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

export const removeImageFile = (path) => {
  return ipcRenderer.invoke('file:removeImageFile', path)
}

export const openFolder = (path) => {
  return ipcRenderer.invoke('file:openFolder', path)
}

export const printPdf = (data) => {
  return ipcRenderer.invoke('print-pdf', data)
}

export const print = (data) => {
  ipcRenderer.send('print', data)
  return true
}

export const testConvert = async () => {
  return await ipcRenderer.invoke('file:testConvert')
}
