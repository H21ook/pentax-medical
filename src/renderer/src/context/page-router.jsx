import React, { useContext, useEffect, useState } from 'react'

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

  useEffect(() => {
    window.electron.ipcRenderer.on('init-page', (_e, data) => {
      setCurrentPageKey(data.pageKey)
      setLoading(false)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('init-page')
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
      setPageParams((prev) => {
        return {
          ...prev,
          [path]: params
        }
      })
    }
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
