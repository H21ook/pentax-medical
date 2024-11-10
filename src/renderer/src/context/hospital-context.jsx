import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const HospitalContext = createContext({
  hospitalData: undefined,
  getHospitalData: () => {}
})

export const useHospital = () => {
  return useContext(HospitalContext)
}
const HospitalProvider = ({ children }) => {
  const [data, setData] = useState()

  const getHospitalData = useCallback(async () => {
    const res = await window.api.getHospitalData()
    setData(res.data)
  }, [])

  useEffect(() => {
    getHospitalData()
  }, [getHospitalData])

  if (!data) {
    return null
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
