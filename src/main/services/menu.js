import { Menu, MenuItem } from 'electron'

export const createMenu = (win) => {
  const mainmenu = new Menu()
  const settingsSubMenu = new Menu()
  settingsSubMenu.append(
    new MenuItem({
      accelerator: process.platform === 'darwin' ? 'Alt+P' : 'Alt+P',
      label: 'Profile Settings',
      click: () => {
        win.webContents.send('stepMenu', {
          path: 'settings',
          params: {
            tabKey: 'profile'
          }
        })
      }
    })
  )
  settingsSubMenu.append(
    new MenuItem({
      accelerator: process.platform === 'darwin' ? 'Alt+H' : 'Alt+H',
      label: 'Hospital Settings',
      click: () => {
        win.webContents.send('stepMenu', {
          path: 'settings',
          params: {
            tabKey: 'hospital'
          }
        })
      }
    })
  )
  settingsSubMenu.append(
    new MenuItem({
      accelerator: process.platform === 'darwin' ? 'Alt+D' : 'Alt+D',
      label: 'Workers Settings',
      click: () => {
        win.webContents.send('stepMenu', {
          path: 'settings',
          params: {
            tabKey: 'workers'
          }
        })
      }
    })
  )

  settingsSubMenu.append(
    new MenuItem({
      accelerator: process.platform === 'darwin' ? 'Alt+M' : 'Alt+M',
      label: 'Address Settings',
      click: () => {
        win.webContents.send('stepMenu', {
          path: 'settings',
          params: {
            tabKey: 'address'
          }
        })
      }
    })
  )
  settingsSubMenu.append(
    new MenuItem({
      accelerator: process.platform === 'darwin' ? 'Alt+C' : 'Alt+C',
      label: 'Data Settings',
      click: () => {
        win.webContents.send('stepMenu', {
          path: 'settings',
          params: {
            tabKey: 'data-store'
          }
        })
      }
    })
  )

  const helpSubMenu = new Menu()
  helpSubMenu.append(
    new MenuItem({
      accelerator: process.platform === 'darwin' ? 'Alt+I' : 'Alt+I',
      label: 'About',
      click: () => {
        win.webContents.send('showAbout')
      }
    })
  )

  mainmenu.append(
    new MenuItem({
      accelerator: process.platform === 'darwin' ? 'Alt+W' : 'Alt+W',
      label: 'Worksheet',
      click: () => {
        win.webContents.send('stepMenu', {
          path: 'main'
        })
      }
    })
  )

  mainmenu.append(
    new MenuItem({
      label: 'Settings',
      submenu: settingsSubMenu
    })
  )

  mainmenu.append(
    new MenuItem({
      label: 'Help',
      submenu: helpSubMenu
    })
  )

  return mainmenu
}
