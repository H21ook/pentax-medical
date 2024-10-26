import { useEffect, useCallback, useState } from 'react'
import WorkerLayout from '../components/layouts/worker-layout'

const MainPage = () => {
  const [users, setUsers] = useState([])

  const getUsers = useCallback(async () => {
    const res = await window.api.getAllUsers()
    setUsers(res || [])
  }, [])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return <WorkerLayout>{JSON.stringify(users, null, 4)}</WorkerLayout>
}

export default MainPage
