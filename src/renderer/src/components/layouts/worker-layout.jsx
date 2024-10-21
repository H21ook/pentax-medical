import Footer from '../Footer'
import Header from '../Header'
import MenuHeader from '../MenuHeader'

const WorkerLayout = ({ children }) => {
  return (
    <div className="select-none h-full w-full flex flex-col">
      <Header />
      <MenuHeader />
      <div className="h-[calc(100vh-129px)] p-2 overflow-y-auto">{children}</div>
      <Footer />
    </div>
  )
}

export default WorkerLayout
