import Header from '../components/Header'
import MenuHeader from '../components/MenuHeader'
import Versions from '../components/Versions'
import Footer from '../components/Footer'

const MainPage = () => {
  const users = window.api.getAllUsers()

  return (
    <div className="select-none h-full w-full flex flex-col">
      <Header />
      <MenuHeader />
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
