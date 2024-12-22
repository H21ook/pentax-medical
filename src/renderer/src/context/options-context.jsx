import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

const OptionsContext = createContext({
  allOptions: [],
  getAllOptions: () => {},
  removeOptions: () => {}
})

export const useOptions = () => {
  return useContext(OptionsContext)
}
const OptionsProvider = ({ children }) => {
  const [allOptions, setAllOptions] = useState([])

  const getAllOptions = useCallback(async () => {
    const res = await window.api.getAllOptions()
    setAllOptions(res)
  }, [])

  useEffect(() => {
    getAllOptions()
  }, [getAllOptions])

  const removeOptions = async (data) => {
    const res = await window.api.deleteOptions({
      id: data.id
    })

    if (res?.result) {
      toast.success('Амжилттай', {
        action: {
          label: 'Хаах',
          onClick: () => {}
        },
        duration: 3000,
        richColors: true,
        description: 'Дата амжилттай устгагдлаа'
      })
    } else {
      toast.error('Амжилтгүй', {
        action: {
          label: 'Хаах',
          onClick: () => {}
        },
        duration: 3000,
        richColors: true,
        description: res?.message || 'Алдаа гарлаа'
      })
    }
  }

  return (
    <OptionsContext.Provider
      value={{
        allOptions: allOptions,
        removeOptions,
        getAllOptions
      }}
    >
      {children}
    </OptionsContext.Provider>
  )
}

export default OptionsProvider
