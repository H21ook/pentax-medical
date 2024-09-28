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
  return (
    <div className="w-full">
      <Menubar className="rounded-none shadow-none border-t-0 border-x-0">
        <MenubarMenu>
          <MenubarTrigger
            onClick={() => {
              console.log('hello')
            }}
          >
            Ажлын хэсэг
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Тохиргоо</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Эмнэлэг <MenubarShortcut>Alt+H</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Дата, өгөгдөл <MenubarShortcut>Alt+D</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Тусламж</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Холбоо барих</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Програмын тухай</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export default MenuHeader
