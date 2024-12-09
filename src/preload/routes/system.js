import { ipcRenderer } from 'electron'

export const saveDataDirectory = async (data, token) => {
  return await ipcRenderer.invoke('system:saveDataDirectory', { data, token })
}
