import { createContext, useCallback, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHospital } from './hospital-context'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

const NewDataContext = createContext({
  newData: undefined,
  tabs: [],
  selectedTab: 0,
  changeNewData: () => {},
  removeTab: () => {},
  addNewTab: () => {},
  addDetailTab: () => {},
  complete: () => {}
})

const formDefaultValues = {
  hospitalName: '',
  departmentName: '',
  date: '',
  diseaseIndication: '',
  anesthesia: '',
  // Patient
  firstName: '',
  lastName: '',
  regNo: '',
  // birthDate: '',
  age: '',
  gender: 'male',
  phoneNumber: '',
  cityId: '',
  districtId: '',
  address: '',
  type: 'upper',
  procedure: 'none',
  scopeType: 'pentax'
}

const NewDataProvider = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const tabsDataStorage = localStorage.getItem('tabs')

  let tabsStorage = [{ name: 'Жагсаалт', type: 'base' }]
  if (tabsDataStorage) {
    tabsStorage = JSON.parse(tabsDataStorage)
  }

  const [tabs, setTabs] = useState(tabsStorage)
  const { hospitalData } = useHospital()

  const newDataStorage = localStorage.getItem('newData')
  let storageNewData = {
    hospitalName: hospitalData?.name,
    departmentName: hospitalData?.departmentName,
    procedure: 'none',
    scopeType: 'pentax'
  }

  if (newDataStorage) {
    const convertedData = JSON.parse(newDataStorage)
    if (convertedData?.uuid) {
      storageNewData = convertedData
    }
  }

  const [newData, setNewData] = useState(storageNewData)
  const generalInformationForm = useForm({
    mode: 'onChange',
    defaultValues: { ...formDefaultValues, ...storageNewData }
  })

  const { reset } = generalInformationForm

  const changeNewData = useCallback((data) => {
    setNewData((prev) => {
      localStorage.setItem('newData', JSON.stringify({ ...prev, ...data }))
      return {
        ...prev,
        ...data
      }
    })
  }, [])

  const removeTab = async (index) => {
    const tempTab = tabs[index]
    setTabs((prev) => {
      const temp = [...prev]
      temp.splice(index, 1)
      localStorage.setItem('tabs', JSON.stringify(temp))
      return temp
    })
    if (selectedTab !== 0 && index <= selectedTab) {
      setSelectedTab((prev) => prev - 1)
    }
    if (tempTab.type === 'new') {
      try {
        await window.api.removeTempFiles(newData?.uuid)
      } catch (err) {
        /* empty */
      }
      setNewData(undefined)
      reset({
        ...formDefaultValues,
        hospitalName: hospitalData?.name,
        departmentName: hospitalData?.departmentName,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      })
      localStorage.removeItem('newData')
    }
  }

  const addNewTab = () => {
    const foundIndex = tabs.findIndex((item) => item.type === 'new')

    console.log('newtab ', newData)
    setTabs((prev) => {
      let resultData = prev
      if (foundIndex < 0) {
        const newT = {
          name: 'Шинэ үзлэг',
          type: 'new'
        }
        resultData = [...prev, newT]
      }
      localStorage.setItem('tabs', JSON.stringify(resultData))
      return resultData
    })

    setSelectedTab(foundIndex < 0 ? tabs.length : foundIndex)
    if (foundIndex < 0) {
      setNewData({
        ...storageNewData,
        uuid: uuidv4(),
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      })
    }
  }

  const addDetailTab = (rowData) => {
    const foundIndex = tabs.findIndex((item) => item?.id === rowData?.id)
    if (foundIndex > -1) {
      setSelectedTab(foundIndex)
      return
    }
    setTabs((prev) => {
      const newT = {
        name: `ID-${rowData?.id}`,
        id: rowData?.id,
        type: 'detail'
      }
      const resultData = [...prev, newT]
      localStorage.setItem('tabs', JSON.stringify(resultData))
      return resultData
    })
    setSelectedTab(tabs.length)
  }

  const complete = (index) => {
    removeTab(index)
  }

  return (
    <NewDataContext.Provider
      value={{
        newData,
        tabs,
        selectedTab,
        generalInformationForm,
        setSelectedTab,
        changeNewData,
        removeTab,
        addNewTab,
        addDetailTab,
        complete
      }}
    >
      {children}
    </NewDataContext.Provider>
  )
}

export default NewDataProvider

export const useNewData = () => {
  return useContext(NewDataContext)
}
