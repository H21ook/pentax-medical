import { useEffect, useCallback, useState } from 'react'
import MainLayout from '../components/layouts/main-layout'

const MainPage = () => {
  const [users, setUsers] = useState([])

  const getUsers = useCallback(async () => {
    const res = await window.api.getAllUsers()
    setUsers(res || [])
  }, [])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return <MainLayout>{JSON.stringify(users, null, 4)}</MainLayout>
}

export default MainPage
