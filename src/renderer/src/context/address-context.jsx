import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AddressContext = createContext({
  allAddressData: [],
  parentAddress: [],
  getAllAddress: () => {}
})

export const useAddress = () => {
  return useContext(AddressContext)
}
const AddressProvider = ({ children }) => {
  const [allAddress, setAllAddress] = useState([])

  const getAllAddress = useCallback(async () => {
    const res = await window.api.getAllAddress()
    setAllAddress(res)
  }, [])

  useEffect(() => {
    getAllAddress()
  }, [getAllAddress])

  const parentAddress = allAddress?.filter((item) => item?.isParent === 1) || []

  return (
    <AddressContext.Provider
      value={{
        allAddressData: allAddress,
        parentAddress,
        getAllAddress
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}

export default AddressProvider
