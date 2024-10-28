import { ipcRenderer } from 'electron'

export const getAllAddress = () => {
  return ipcRenderer.invoke('address:getAllAddress')
}

export const saveAddress = (data) => {
  return ipcRenderer.invoke('address:saveAddress', data)
}

export const deleteAddress = (id) => {
  return ipcRenderer.invoke('address:deleteAddress', id)
}
