import { Toaster } from './components/ui/Toaster'
import { Route, Routes, HashRouter } from 'react-router-dom'
import AuthProvider from './context/auth-context'
import UsersProvider from './context/users-context'
import HospitalProvider from './context/hospital-context'
import AddressProvider from './context/address-context'
import NewDataProvider from './context/new-data-context'
import PageRouterProvider from './context/page-router'
import LoaderPage from './pages/Loader'
import GetStarted from './pages/GetStarted'
import MainPage from './pages/Main'
import RootConfig from './pages/RootConfig'
import Login from './pages/Login'
import Settings from './pages/Settings'
import PrintPage from './components/main/PrintPage'
import OptionsProvider from './context/options-context'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          index
          element={
            <div className="h-screen w-full">
              <AuthProvider>
                <OptionsProvider>
                  <UsersProvider>
                    <HospitalProvider>
                      <AddressProvider>
                        <NewDataProvider>
                          <PageRouterProvider
                            defaultPageKey={'loader'}
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
                        </NewDataProvider>
                      </AddressProvider>
                    </HospitalProvider>
                  </UsersProvider>
                </OptionsProvider>
              </AuthProvider>
              <Toaster />
            </div>
          }
        />
        <Route
          path="print"
          element={
            <div className="h-screen w-full">
              <AuthProvider>
                <OptionsProvider>
                  <UsersProvider>
                    <HospitalProvider>
                      <AddressProvider>
                        <NewDataProvider>
                          <PrintPage />
                        </NewDataProvider>
                      </AddressProvider>
                    </HospitalProvider>
                  </UsersProvider>
                </OptionsProvider>
              </AuthProvider>
              <Toaster />
            </div>
          }
        />
      </Routes>
    </HashRouter>
  )
}

export default App
