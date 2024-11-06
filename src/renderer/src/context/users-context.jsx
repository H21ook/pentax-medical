import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const UsersContext = createContext({
  users: [],
  getUsers: () => {}
})

export const useUsers = () => {
  return useContext(UsersContext)
}

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const getUsers = useCallback(async () => {
    const res = await window.api.getAllUsers()
    setUsers(res)
  }, [])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return (
    <UsersContext.Provider
      value={{
        users,
        getUsers
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export default UsersProvider
