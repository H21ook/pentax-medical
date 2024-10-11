import PageRouterProvider from './context/page-router'
import LoaderPage from './pages/loader-page'
import GetStartedPage from './pages/get-started-page'
import MainPage from './pages/main-page'
import RootConfigPage from './pages/root-config-page'
import { LoginPage } from './pages/login-page'
import AuthProvider from './context/auth-context'
import HospitalSettingsPage from './pages/hospital-settings-page'

function App() {
  return (
    <div className="h-screen w-full">
      <AuthProvider>
        <PageRouterProvider
          defaultPageKey="loader"
          routes={[
            {
              key: 'loader',
              page: <LoaderPage />
            },
            {
              key: 'get-started',
              page: <GetStartedPage />
            },
            {
              key: 'main',
              page: <MainPage />
            },
            {
              key: 'root-config',
              page: <RootConfigPage />
            },
            {
              key: 'login',
              page: <LoginPage />
            },
            {
              key: 'hospital-settings',
              page: <HospitalSettingsPage />
            }
          ]}
        />
      </AuthProvider>
    </div>
  )
}

export default App
