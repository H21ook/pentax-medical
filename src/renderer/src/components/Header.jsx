import { useEffect, useState } from 'react'
import logoImage from '../assets/logo.svg'
import closeIcon from '../assets/icons/close.png'
import restoreIcon from '../assets/icons/resize.png'
import maximizeIcon from '../assets/icons/maximize.png'
import minimizeIcon from '../assets/icons/minimize.png'
import styles from './style.module.css'

const Header = () => {
  const defaultMaximize = localStorage.getItem('maximize') === 'true'
  const [isMaximized, setIsMaximized] = useState(defaultMaximize)

  useEffect(() => {
    // main-с мессеж хүлээн авах
    window.electron.ipcRenderer.on('setMaximize', (_e, data) => {
      setIsMaximized(data)
      localStorage.setItem('maximize', data)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('setMaximize')
    }
  }, [])

  return (
    <div className="w-full bg-slate-200 flex justify-between items-start select-none">
      <div className={`p-2 flex-1 ${styles.header}`}>
        <img src={logoImage} alt="pentax medical logo" className="h-6" />
      </div>
      <div className="flex items-center h-10">
        <button
          className="h-10 w-10 flex items-center justify-center hover:bg-gray-300"
          onClick={() => {
            window.electron.ipcRenderer.send('minimize')
          }}
        >
          <img alt="minimize" src={minimizeIcon} className="h-6 w-6" />
        </button>
        <button
          className="h-10 w-10 flex items-center justify-center hover:bg-gray-300"
          onClick={() => {
            window.electron.ipcRenderer.send(isMaximized ? 'restore' : 'maximize')
          }}
        >
          <img
            alt="restore-and-maximize"
            src={isMaximized ? restoreIcon : maximizeIcon}
            className="h-6 w-6"
          />
        </button>
        <button
          className="group h-full w-10 flex items-center justify-center hover:bg-primary"
          onClick={() => {
            window.electron.ipcRenderer.send('close')
          }}
        >
          <img alt="close" src={closeIcon} className="h-6 w-6 group-hover:invert" />
        </button>
      </div>
    </div>
  )
}

export default Header
