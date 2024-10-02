import Header from '../Header'

const AdminLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default AdminLayout
