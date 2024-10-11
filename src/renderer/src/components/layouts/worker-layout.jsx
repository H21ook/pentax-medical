import Footer from '../Footer'
import Header from '../Header'
import MenuHeader from '../MenuHeader'

const WorkerLayout = ({ children }) => {
  return (
    <div className="select-none h-full w-full flex flex-col">
      <Header />
      <MenuHeader />
      <div className="flex-1 p-2">{children}</div>
      <Footer />
    </div>
  )
}

export default WorkerLayout
