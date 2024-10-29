import PageRouterProvider from './context/page-router'
import LoaderPage from './pages/Loader'
import GetStarted from './pages/GetStarted'
import MainPage from './pages/main'
import RootConfig from './pages/RootConfig'
import Login from './pages/Login'
import AuthProvider from './context/auth-context'
import { Toaster } from './components/ui/Toaster'
import Settings from './pages/Settings'
import HospitalProvider from './context/hospital-context'
import AddressProvider from './context/address-context'

function App() {
  return (
    <div className="h-screen w-full">
      <AuthProvider>
        <HospitalProvider>
          <AddressProvider>
            <PageRouterProvider
              defaultPageKey="loader"
              routes={[
                {
                  key: 'loader',
                  page: <LoaderPage />
                },
                {
                  key: 'get-started',
                  page: <GetStarted />
                },
                {
                  key: 'main',
                  page: <MainPage />
                },
                {
                  key: 'root-config',
                  page: <RootConfig />
                },
                {
                  key: 'login',
                  page: <Login />
                },
                {
                  key: 'settings',
                  page: <Settings />
                }
              ]}
            />
          </AddressProvider>
        </HospitalProvider>
      </AuthProvider>
      <Toaster />
    </div>
  )
}

export default App
