import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import LoaderPage from '../pages/Loader'

const HospitalContext = createContext({
  hospitalData: undefined,
  dataConfig: undefined,
  getHospitalData: () => {}
})

export const useHospital = () => {
  return useContext(HospitalContext)
}
const HospitalProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState()
  const [dataConfig, setDataConfig] = useState()

  const getHospitalData = useCallback(async () => {
    const res = await window.api.getHospitalData()
    setData(res.data)
    setIsLoading(false)
  }, [])

  const loadDataConfig = useCallback(async () => {
    const res = await window.api.getDataConfig()
    setDataConfig(res)
  }, [])

  useEffect(() => {
    getHospitalData()
    loadDataConfig()
  }, [getHospitalData, loadDataConfig])

  if (isLoading) {
    return <LoaderPage />
  }

  return (
    <HospitalContext.Provider
      value={{
        hospitalData: data,
        dataConfig,
        getHospitalData,
        loadDataConfig
      }}
    >
      {children}
    </HospitalContext.Provider>
  )
}

export default HospitalProvider
