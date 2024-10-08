import React, { useContext, useEffect, useState } from 'react'

const PageRouterContext = React.createContext({
  push: () => {},
  back: () => {},
  restart: () => {},
  params: undefined,
  currentPageKey: ''
})

export const useRouter = () => {
  return useContext(PageRouterContext)
}
const PageRouterProvider = ({ routes = [], defaultPageKey }) => {
  const [pages, setPages] = useState([defaultPageKey])
  const [pageParams, setPageParams] = useState({})
  const [currentPageKey, setCurrentPageKey] = useState(defaultPageKey)

  useEffect(() => {
    window.electron.ipcRenderer.on('init-page', (_e, data) => {
      setPages([defaultPageKey, data.pageKey])
      setCurrentPageKey(data.pageKey)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('init-page')
    }
  }, [])

  useEffect(() => {
    if (pages.length < 2) {
      window.electron.ipcRenderer.send('init-page', {
        token: localStorage.getItem('token')
      })
    }
  }, [pages])

  const back = () => {
    if (pages.length > 0) {
      const lastPage = pages[pages.length - 1]
      if (pageParams?.[lastPage]) {
        setPageParams((prev) => {
          return {
            ...prev,
            [lastPage]: undefined
          }
        })
      }

      const prevPage = pages[pages.length - 2]
      setPages((prev) => {
        const temp = [...prev]
        temp.splice(temp.length - 1, 1)
        return temp
      })
      setCurrentPageKey(prevPage)
    }
  }

  const push = (path, params) => {
    setPages((prev) => {
      const temp = [...prev]
      temp.push(path)
      return temp
    })
    setPageParams((prev) => {
      return {
        ...prev,
        [path]: params
      }
    })
    setCurrentPageKey(path)
  }

  const restart = () => {
    setPages([defaultPageKey])
    setPageParams({})
    setCurrentPageKey(defaultPageKey)
  }

  const currentPage = routes.find((r) => r.key === currentPageKey)

  return (
    <PageRouterContext.Provider
      value={{
        push,
        back,
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
