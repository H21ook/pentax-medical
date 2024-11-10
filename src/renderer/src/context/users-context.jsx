import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const UsersContext = createContext({
  users: [],
  employees: [],
  getUsers: () => {},
  getEmployeeList: () => {}
})

export const useUsers = () => {
  return useContext(UsersContext)
}

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [employees, setEmployees] = useState([])
  const getUsers = useCallback(async () => {
    const res = await window.api.getAllUsers()
    setUsers(res)
  }, [])

  const getEmployeeList = useCallback(async () => {
    const res = await window.api.getEmployeeList()
    setEmployees(res)
  }, [])

  useEffect(() => {
    getUsers()
    getEmployeeList()
  }, [getUsers, getEmployeeList])

  return (
    <UsersContext.Provider
      value={{
        users,
        employees,
        getUsers,
        getEmployeeList
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export default UsersProvider
