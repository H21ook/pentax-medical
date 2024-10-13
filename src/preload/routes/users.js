import { ipcRenderer } from 'electron'

export const getAllUsers = () => {
  return ipcRenderer.invoke('user:getAllUsers')
}
