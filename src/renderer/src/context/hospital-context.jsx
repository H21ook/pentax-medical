import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import LoaderPage from '../pages/Loader'

const HospitalContext = createContext({
  hospitalData: undefined,
  getHospitalData: () => {}
})

export const useHospital = () => {
  return useContext(HospitalContext)
}
const HospitalProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState()

  const getHospitalData = useCallback(async () => {
    const res = await window.api.getHospitalData()
    setData(res.data)
    setIsLoading(false);
  }, [])

  useEffect(() => {
    getHospitalData()
  }, [getHospitalData])

  if(isLoading) {
    return <LoaderPage />
  }

  return (
    <HospitalContext.Provider
      value={{
        hospitalData: data,
        getHospitalData
      }}
    >
      {children}
    </HospitalContext.Provider>
  )
}

export default HospitalProvider
