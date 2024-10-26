import { ipcRenderer } from 'electron'

export const getHospitalData = () => {
  return ipcRenderer.invoke('hospital:getHospitalData')
}

export const createHospitalData = (data, token) => {
  console.log(data, token)
  return ipcRenderer.invoke('hospital:createHospital', {
    data,
    token
  })
}

export const updateHospitalData = (data, token) => {
  return ipcRenderer.invoke('hospital:updateHospital', {
    data,
    token
  })
}
