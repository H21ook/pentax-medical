import Header from '../components/Header'
import MenuHeader from '../components/MenuHeader'
import { Button } from '../components/ui/Button'
import Versions from '../components/Versions'
import Footer from '../components/Footer'

const MainPage = () => {
  const users = window.api.getAllUsers()

  return (
    <div>
      <Header />
      <MenuHeader />
      <Button>Hi! Baby</Button>
      {users.map((item) => {
        return item.username
      })}
      <div className="flex-1">
        <Versions></Versions>
      </div>
      <Footer />
    </div>
  )
}

export default MainPage
