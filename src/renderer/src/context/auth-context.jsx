import React, { useState, useCallback, useEffect, useContext } from 'react'

const AuthContext = React.createContext({
  isLogged: false,
  user: undefined,
  token: undefined,
  checkLogged: () => {},
  getUserData: () => {}
})

export const useAuth = () => {
  return useContext(AuthContext)
}
const AuthProvider = ({ children }) => {
  const [isLogged, setLogged] = useState(false)
  const [user, setUser] = useState()

  const getUserData = useCallback(async (_token) => {
    const token = localStorage.getItem('token')
    const res = await window.api.getProfile(_token || token)
    if (res?.result) {
      console.log('getProfile ', res.data)
      setUser(res.data)
    }
  }, [])

  const checkLogged = useCallback(async () => {
    const token = localStorage.getItem('token')

    const tokenResult = await window.api.checkToken(token)
    if (tokenResult.data?.isLogged) {
      setLogged(isLogged)
      console.log(tokenResult)
      getUserData(token)
    }
    setLogged(false)
  }, [getUserData])

  const getToken = () => {
    return localStorage.getItem('token')
  }

  useEffect(() => {
    checkLogged()
  }, [checkLogged])

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        user,
        token: getToken(),
        checkLogged,
        getUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
