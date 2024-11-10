import { ipcRenderer } from 'electron'

export const getEmployeeList = () => {
  return ipcRenderer.invoke('employee:employeeList')
}

export const getEmployeeImagesList = () => {
  return ipcRenderer.invoke('employee:employeeImages')
}

export const createEmployee = (data) => {
  return ipcRenderer.invoke('employee:create', data)
}
