import { ipcRenderer } from 'electron'

export const getEmployeeList = () => {
  return ipcRenderer.invoke('employee:employeeList')
}

export const getEmployee = (id) => {
  return ipcRenderer.invoke('employee:getEmployee', id)
}

export const getEmployeeImagesList = () => {
  return ipcRenderer.invoke('employee:employeeImages')
}

export const createEmployee = (data) => {
  return ipcRenderer.invoke('employee:create', data)
}

export const updateEmployee = (data) => {
  return ipcRenderer.invoke('employee:update', data)
}

export const deleteEmployee = (id) => {
  return ipcRenderer.invoke('employee:delete', id)
}
