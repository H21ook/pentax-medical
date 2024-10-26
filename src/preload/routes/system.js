import { ipcRenderer } from 'electron'

export const saveDataDirectory = async (data) => {
  return await ipcRenderer.invoke('system:saveDataDirectory', data)
}
