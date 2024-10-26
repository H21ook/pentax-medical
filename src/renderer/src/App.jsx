import PageRouterProvider from './context/page-router'
import LoaderPage from './pages/loader-page'
import GetStarted from './pages/GetStarted'
import MainPage from './pages/main-page'
import RootConfig from './pages/RootConfig'
import Login from './pages/Login'
import AuthProvider from './context/auth-context'
import { Toaster } from './components/ui/Toaster'
import Settings from './pages/Settings'
import HospitalProvider from './context/hospital-context'

function App() {
  return (
    <div className="h-screen w-full">
      <AuthProvider>
        <HospitalProvider>
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
        </HospitalProvider>
      </AuthProvider>
      <Toaster />
    </div>
  )
}

export default App
