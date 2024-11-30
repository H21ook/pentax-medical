import { ipcRenderer } from 'electron'

export const getDataConfig = async () => {
  return await ipcRenderer.invoke('system:getDataConfig')
}
