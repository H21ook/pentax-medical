import { Menu, MenuItem } from 'electron'

export const createMenu = (win) => {
  const mainmenu = new Menu()
  const settingsSubMenu = new Menu()
  settingsSubMenu.append(
    new MenuItem({
      accelerator: process.platform === 'darwin' ? 'Alt+H' : 'Alt+H',
      label: 'Hospital Settings',
      click: () => {
        win.webContents.send('stepHospitalSettings')
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
        win.webContents.send('stepWorksheet')
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
