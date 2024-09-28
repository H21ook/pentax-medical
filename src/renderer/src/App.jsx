import Header from './components/Header'
import Footer from './components/Footer'
import Versions from './components/Versions'
import MenuHeader from './components/MenuHeader'
import { Button } from './components/ui/Button'

function App() {
  const users = window.api.getAllUsers()
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <div className="h-screen w-full flex flex-col items-center ">
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

export default App
