import { useState } from 'react'
import MainLayout from '../components/layouts/main-layout'
import { ScrollArea } from '../components/ui/ScrollArea'
import HospitalSettings from '../components/settings/HospitalSettings'
import WorkerSettings from '../components/settings/WorkerSettings'
import ProfileSettings from '../components/settings/ProfileSettings'

const Settings = () => {
  const [selectedMenu, setSelectedMenu] = useState('profile')
  const menu = [
    {
      key: 'profile',
      name: 'Хувийн мэдээлэл',
      tab: <ProfileSettings />
    },
    {
      key: 'hospital',
      name: 'Эмнэлэг',
      tab: <HospitalSettings />
    },
    {
      key: 'workers',
      name: 'Ажилчид',
      tab: <WorkerSettings />
    },
    {
      key: 'address',
      name: 'Хаяг'
    },
    {
      key: 'data-store',
      name: 'Дата хадгалалт'
    }
  ]

  const selectedTab = menu.find((item) => item.key === selectedMenu).tab

  return (
    <MainLayout>
      <div className="w-full h-full flex">
        <ScrollArea className="h-full w-[200px] bg-gray-100">
          <ul className="list-none flex flex-col gap-[2px] py-4">
            {menu.map((item) => (
              <li
                key={item.key}
                onClick={() => {
                  setSelectedMenu(item.key)
                }}
                className={`relative py-2 px-4 text-sm font-medium transition-all duration-300 hover:bg-white before:content-[""] before:absolute before:z-[0] before:top-0 before:left-0 before:bottom-0 before:w-1 ${selectedMenu === item.key ? ' before:bg-primary bg-white font-bold' : ' before:bg-transparent'}`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="flex-1 px-8 py-4">{selectedTab}</div>
      </div>
    </MainLayout>
  )
}

export default Settings
