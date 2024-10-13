import React, { useState, useCallback, useEffect, useContext } from 'react'

const AuthContext = React.createContext({
  isLogged: false,
  user: undefined,
  checkLogged: () => {}
})

export const useAuth = () => {
  return useContext(AuthContext)
}
const AuthProvider = ({ children }) => {
  const [isLogged, setLogged] = useState(false)
  const [user, setUser] = useState()

  const checkLogged = useCallback(async () => {
    const token = localStorage.getItem('token')

    const tokenResult = await window.api.checkToken(token)
    if (tokenResult?.data) {
      const { isLogged, ...user } = tokenResult.data
      setLogged(isLogged)
      setUser(user)
    }
    setLogged(false)
  }, [])

  useEffect(() => {
    checkLogged()
  }, [checkLogged])

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        user,
        checkLogged
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
