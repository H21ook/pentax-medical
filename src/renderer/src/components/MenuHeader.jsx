import { useEffect } from 'react'
import { useAuth } from '../context/auth-context'
import { useRouter } from '../context/page-router'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger
} from './ui/Menubar'

const MenuHeader = () => {
  const router = useRouter()
  const { user } = useAuth()

  const WORKSHEET_MENU = {
    trigger: 'Ажлын хэсэг',
    onClick: () => {
      router.change('main')
    }
  }

  const HELP_MENU = {
    trigger: 'Тусламж',
    children: [
      {
        label: 'Холбоо барих'
      },
      {
        label: 'Програмын тухай',
        shortcut: <MenubarShortcut>Alt+I</MenubarShortcut>,
        onClick: () => {
          window.electron.ipcRenderer.send('showAbout')
        }
      }
    ]
  }
  const ADMIN_MENU = [
    WORKSHEET_MENU,
    {
      trigger: 'Тохиргоо',
      children: [
        {
          label: 'Эмнэлэг',
          shortcut: <MenubarShortcut>Alt+H</MenubarShortcut>,
          onClick: () => {
            router.change('settings')
          }
        },
        {
          label: 'Дата, өгөгдөл',
          shortcut: <MenubarShortcut>Alt+D</MenubarShortcut>
        }
      ]
    },
    HELP_MENU
  ]

  const WORKER_MENU = [WORKSHEET_MENU, HELP_MENU]

  const menu = user?.role === 'admin' ? ADMIN_MENU : WORKER_MENU

  useEffect(() => {
    // main-с мессеж хүлээн авах

    window.electron.ipcRenderer.on('showAbout', () => {
      window.electron.ipcRenderer.send('showAbout')
    })

    window.electron.ipcRenderer.on('stepWorksheet', () => {
      router.change('main')
    })

    if (user?.role === 'admin') {
      window.electron.ipcRenderer.on('stepSettings', () => {
        router.change('settings')
      })
    }

    return () => {
      window.electron.ipcRenderer.removeAllListeners('stepSettings')
      window.electron.ipcRenderer.removeAllListeners('showAbout')
    }
  }, [user])

  return (
    <div className="w-full">
      <Menubar className="rounded-none shadow-none border-t-0 border-x-0">
        {menu.map((group, gIndex) => {
          return (
            <MenubarMenu key={`group_${gIndex}`}>
              <MenubarTrigger onClick={group?.onClick}>{group.trigger}</MenubarTrigger>
              {group?.children?.length > 0 && (
                <MenubarContent>
                  {group.children.map((item, index) => (
                    <MenubarItem key={`group_${gIndex}_item_${index}`} onClick={item?.onClick}>
                      {item.label} {item.shortcut}
                    </MenubarItem>
                  ))}
                </MenubarContent>
              )}
            </MenubarMenu>
          )
        })}
      </Menubar>
    </div>
  )
}

export default MenuHeader
