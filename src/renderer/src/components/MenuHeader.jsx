import { Fragment, useEffect } from 'react'
import { useAuth } from '../context/auth-context'
import { useRouter } from '../context/page-router'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
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
          label: 'Хувийн мэдээлэл',
          shortcut: <MenubarShortcut>Alt+P</MenubarShortcut>,
          onClick: () => {
            router.change('settings', {
              tabKey: 'profile'
            })
          },
          seperator: true
        },
        {
          label: 'Эмнэлэг',
          shortcut: <MenubarShortcut>Alt+H</MenubarShortcut>,
          onClick: () => {
            router.change('settings', {
              tabKey: 'hospital'
            })
          }
        },
        {
          label: 'Үзлэгийн тохиргоо',
          onClick: () => {
            router.change('settings', {
              tabKey: 'settings'
            })
          }
        },
        {
          label: 'Ажилчид',
          shortcut: <MenubarShortcut>Alt+D</MenubarShortcut>,
          onClick: () => {
            router.change('settings', {
              tabKey: 'workers'
            })
          }
        },
        {
          label: 'Хаяг',
          shortcut: <MenubarShortcut>Alt+M</MenubarShortcut>,
          onClick: () => {
            router.change('settings', {
              tabKey: 'address'
            })
          },
          seperator: true
        },
        {
          label: 'Дата хадгалалт',
          shortcut: <MenubarShortcut>Alt+C</MenubarShortcut>,
          onClick: () => {
            router.change('settings', {
              tabKey: 'data-store'
            })
          }
        }
      ]
    },
    HELP_MENU
  ]

  const menu = ADMIN_MENU

  useEffect(() => {
    // main-с мессеж хүлээн авах

    window.electron.ipcRenderer.on('showAbout', () => {
      window.electron.ipcRenderer.send('showAbout')
    })

    window.electron.ipcRenderer.on('stepMenu', (_, { path, params }) => {
      router.change(path, params)
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners('stepMenu')
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
                    <Fragment key={`group_${gIndex}_item_${index}`}>
                      <MenubarItem onClick={item?.onClick}>
                        {item.label} {item.shortcut}
                      </MenubarItem>
                      {item.seperator && <MenubarSeparator />}
                    </Fragment>
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
