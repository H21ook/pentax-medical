import { createContext, useCallback, useContext, useEffect, useState } from 'react'
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
  addDetailTab: () => {}
})

const formDefaultValues = {
  uuid: '',
  hospitalName: '',
  departmentName: '',
  date: '',
  patientCondition: '',
  diseaseIndication: '',
  anesthesia: '',
  // Patient
  firstName: '',
  lastName: '',
  regNo: '',
  birthDate: '',
  age: '',
  gender: 'male',
  phoneNumber: '',
  profession: '',
  cityId: '',
  districtId: '',
  address: ''
}

const NewDataProvider = ({ children }) => {
  const { hospitalData } = useHospital()
  const [tabs, setTabs] = useState([{ name: 'Жагсаалт', type: 'base' }])
  const [selectedTab, setSelectedTab] = useState(0)
  const [newData, setNewData] = useState()
  const [isLoadData, setIsLoadData] = useState(false)

  const generalInformationForm = useForm({
    defaultValues: formDefaultValues
  })
  const { reset } = generalInformationForm

  useEffect(() => {
    const newDataStorage = localStorage.getItem('newData')
    const tabsDataStorage = localStorage.getItem('tabs')

    if (newDataStorage) {
      const _newData = JSON.parse(newDataStorage)
      setNewData(_newData)
      reset({
        uuid: _newData.uuid,
        hospitalName: _newData?.hospitalName,
        departmentName: _newData?.departmentName,
        date: _newData?.date,
        patientCondition: _newData?.patientCondition,
        diseaseIndication: _newData?.diseaseIndication,
        anesthesia: _newData?.anesthesia,
        firstName: _newData?.firstName,
        lastName: _newData?.lastName,
        regNo: _newData?.regNo,
        birthDate: _newData?.birthDate,
        age: _newData?.age,
        gender: _newData?.gender,
        phoneNumber: _newData?.phoneNumber,
        profession: _newData?.profession,
        cityId: _newData?.cityId,
        districtId: _newData?.districtId,
        address: _newData?.address,
        nurseId: _newData?.nurseId,
        doctorId: _newData?.doctorId,
        diagnosis: _newData?.diagnosis,
        summary: _newData?.summary
      })
    } else {
      reset({
        ...formDefaultValues,
        uuid: uuidv4(),
        hospitalName: hospitalData?.name,
        departmentName: hospitalData?.departmentName,
        date: format(new Date(), 'yyyy-MM-dd')
      })
    }

    if (tabsDataStorage) {
      setTabs(JSON.parse(tabsDataStorage))
    }
    setIsLoadData(true)
  }, [hospitalData, reset])

  const changeNewData = useCallback((data) => {
    localStorage.setItem('newData', JSON.stringify(data))
    setNewData((prev) => {
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
    if (tempTab.type === 'new') {
      await window.api.removeTempFiles(newData.uuid)
      setNewData(undefined)
      reset({ ...formDefaultValues, uuid: uuidv4() })
      localStorage.removeItem('newData')
    }
    if (selectedTab !== 0 && index <= selectedTab) {
      setSelectedTab((prev) => prev - 1)
    }
  }

  const addNewTab = () => {
    const foundIndex = tabs.findIndex((item) => item.type === 'new')
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
  }

  const addDetailTab = (rowData) => {
    const foundIndex = tabs.findIndex((item) => item?.id === rowData?.id)
    if (foundIndex > -1) {
      setSelectedTab(foundIndex)
      return
    }
    setTabs((prev) => {
      const newT = {
        name: `${rowData?.id}|${rowData.lastName}`,
        id: rowData?.id,
        type: 'detail'
      }
      const resultData = [...prev, newT]
      localStorage.setItem('tabs', JSON.stringify(resultData))
      return resultData
    })
    setSelectedTab(tabs.length)
  }

  if (!isLoadData) {
    return null
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
        addDetailTab
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
