import { useEffect, useCallback, useState } from 'react'
import WorkerLayout from '../components/layouts/worker-layout'
import Versions from '../components/Versions'

const MainPage = () => {
  const [users, setUsers] = useState([])
  const getUsers = useCallback(async () => {
    const res = await window.api.getAllUsers()
    setUsers(res || [])
  }, [])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return (
    <WorkerLayout>
      {users.map((item) => {
        return item.username
      })}
      <div className="">
        <Versions></Versions>
      </div>
    </WorkerLayout>
  )
}

export default MainPage
