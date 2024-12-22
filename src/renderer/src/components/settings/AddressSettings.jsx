import { RxPlus } from 'react-icons/rx'
import { Button } from '../ui/Button'
import { ScrollArea } from '../ui/ScrollArea'
import { useState } from 'react'
import AddressRegisterModal from '../address-register-modal'
import { useAddress } from '../../context/address-context'

const AddressSettings = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedParent, setSelectedParent] = useState()
  const { allAddressData, parentAddress, getAllAddress } = useAddress()

  const childAddress = allAddressData?.filter((item) => item?.parentId === selectedParent?.id) || []

  return (
    <div>
      <div className="flex justify-between items-start">
        <h1 className="font-semibold mb-4 mt-2">Хаягийн бүртгэл</h1>
        <Button
          variant="outline"
          className="h-8 px-2 lg:px-3"
          onClick={() => {
            setIsOpenModal(true)
          }}
        >
          <RxPlus className="mr-2" /> Хаяг бүртгэх
        </Button>
      </div>
      <AddressRegisterModal
        parentAddress={parentAddress}
        open={isOpenModal}
        onHide={() => {
          setIsOpenModal(false)
        }}
        onSuccess={getAllAddress}
      />
      <div className="w-full flex gap-8">
        <div className="flex-1 rounded-lg border pt-4">
          <h4 className="mb-4 text-sm font-bold leading-none px-4">Хот/Аймаг</h4>
          <ScrollArea className="h-[calc(100vh-254px)]">
            <ul className="list-none px-4 pb-4">
              {parentAddress.map((item) => {
                return (
                  <li
                    key={`parent_${item.id}`}
                    onClick={() => {
                      setSelectedParent(item)
                    }}
                    className="p-2 rounded-sm hover:bg-muted"
                  >
                    {item.name}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        </div>

        <div className="flex-1 rounded-lg border pt-4">
          <h4 className="mb-4 text-sm font-bold leading-none px-4">Дүүрэг/Сум</h4>
          <ScrollArea className="h-[calc(100vh-254px)]">
            <ul className="list-none px-4 pb-4">
              {childAddress.map((item) => {
                return (
                  <li key={`parent_${item.id}`} className="p-2 rounded-sm hover:bg-muted text-sm">
                    {item.name}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default AddressSettings
