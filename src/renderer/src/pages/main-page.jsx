import WorkerLayout from '../components/layouts/worker-layout'
import Versions from '../components/Versions'

const MainPage = () => {
  const users = window.api.getAllUsers()

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
