import React, { useContext, useEffect, useState } from 'react'
import { useNewData } from './new-data-context'

const PageRouterContext = React.createContext({
  change: () => {},
  restart: () => {},
  params: undefined,
  currentPageKey: ''
})

export const useRouter = () => {
  return useContext(PageRouterContext)
}

const PageRouterProvider = ({ routes = [], defaultPageKey }) => {
  const [loading, setLoading] = useState(true)
  const [pageParams, setPageParams] = useState()
  const [currentPageKey, setCurrentPageKey] = useState(defaultPageKey)
  const { tabs, setSelectedTab } = useNewData()

  useEffect(() => {
    window.electron.ipcRenderer.on('init-page', (_e, data) => {
      setCurrentPageKey(data?.pageKey)
      if (data?.pageKey === 'login') {
        localStorage.removeItem('newData')
        localStorage.removeItem('tabs')
      }
      setLoading(false)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('init-page')
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key[0] === 'F' && event.key.length === 2) {
        event.preventDefault()
        const keyIndex = Number(event.key[1]) - 1
        setCurrentPageKey('main')
        if (tabs.length > keyIndex) {
          setSelectedTab(keyIndex)
        }
        // Your application logic here, e.g., saving data or triggering a function
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (loading) {
      window.electron.ipcRenderer.send('init-page', {
        token: localStorage.getItem('token')
      })
    }
  }, [loading])

  const change = (path, params) => {
    if (path !== currentPageKey) {
      setCurrentPageKey(path)
    }
    setPageParams((prev) => {
      return {
        ...prev,
        [path]: params
      }
    })
  }

  const restart = () => {
    setLoading(true)
    setPageParams({})
    setCurrentPageKey(defaultPageKey)
  }

  const currentPage = routes.find((r) => r.key === currentPageKey)

  return (
    <PageRouterContext.Provider
      value={{
        change,
        restart,
        currentPageKey,
        params: pageParams?.[currentPageKey]
      }}
    >
      {currentPage?.page}
    </PageRouterContext.Provider>
  )
}

export default PageRouterProvider
