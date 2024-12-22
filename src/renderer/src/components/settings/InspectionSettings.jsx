import { RxPencil1 } from 'react-icons/rx'
import { useOptions } from '../../context/options-context'
import { ScrollArea } from '../ui/ScrollArea'
import { Button } from '../ui/Button'
import { LuPlus } from 'react-icons/lu'
import { Separator } from '../ui/seperator'
import UpdateOptionModal from '../update-option-modal'
import { useState } from 'react'
import CreateOptionModal from '../create-option-modal'

const InspectionSettings = () => {
  const { allOptions, getAllOptions } = useOptions()
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false)
  const [selectedTypeData, setSelectedTypeData] = useState()

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  const [selectedType, setSelectedType] = useState()
  const [title, setTitle] = useState('')

  const inspectionData = allOptions?.filter((item) => item.type === 'inspectionType')
  const scopeData = allOptions?.filter((item) => item.type === 'scopeType')
  const procedureData = allOptions?.filter((item) => item.type === 'procedureType')
  const anesthesiaData = allOptions?.filter((item) => item.type === 'anesthesia')
  const diagnosisData = allOptions?.filter((item) => item.type === 'diagnosis')

  return (
    <div className="w-full">
      <h1 className="font-semibold mb-4 mt-2">Үзлэгийн тохиргоо</h1>
      <div className="w-full flex gap-8">
        <div className="flex-1">
          <div className="h-8 flex items-center mb-2">
            <p className="font-semibold text-sm">Үзлэгийн төрөл</p>
          </div>
          <div className="border rounded-lg py-2">
            <ScrollArea className="max-h-[200px] w-full px-2">
              {inspectionData.map((option) => {
                return (
                  <div
                    key={option.id}
                    className="group/item text-sm py-1 px-2 hover:bg-muted rounded-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p>{option?.name}</p>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="size-6 rounded-sm invisible hover:bg-slate-200 group-hover/item:visible"
                        onClick={() => {
                          setSelectedTypeData(option)
                          setIsOpenUpdateModal(true)
                        }}
                      >
                        <RxPencil1 />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </ScrollArea>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-8 flex items-center justify-between mb-2">
            <p className="font-semibold text-sm">Дурангийн төрөл</p>
          </div>
          <div className="border rounded-lg py-2">
            <ScrollArea className="max-h-[200px] w-full px-2">
              {scopeData.map((option) => {
                return (
                  <div key={option.id} className="text-sm py-1 px-2 hover:bg-muted rounded-sm">
                    {option?.name}
                  </div>
                )
              })}
            </ScrollArea>
          </div>
        </div>
      </div>

      <Separator className="my-6" />
      <div className="w-full flex gap-4">
        <div className="flex-1">
          <div className="h-8 flex items-center justify-between mb-2">
            <p className="font-semibold text-sm">Онош</p>
            <Button
              size="icon"
              type="button"
              className="size-8"
              onClick={() => {
                setSelectedType('diagnosis')
                setIsOpenCreateModal(true)
                setTitle('Онош бүртгэх')
              }}
            >
              <LuPlus />
            </Button>
          </div>
          <div className="border rounded-lg py-2">
            <ScrollArea className="h-[200px] w-full px-2">
              {diagnosisData?.length > 0 ? (
                diagnosisData.map((option) => {
                  return (
                    <div
                      key={option.id}
                      className="group/item text-sm py-1 px-2 hover:bg-muted rounded-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p>{option?.name}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
                  Дата байхгүй
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-8 flex items-center justify-between mb-2">
            <p className="font-semibold text-sm">Мэдээ алдуулалт</p>
            <Button
              size="icon"
              className="size-8"
              type="button"
              onClick={() => {
                setSelectedType('anesthesia')
                setIsOpenCreateModal(true)
                setTitle('Мэдээ алдуулалт бүртгэх')
              }}
            >
              <LuPlus />
            </Button>
          </div>
          <div className="border rounded-lg py-2">
            <ScrollArea className="h-[200px] w-full px-2">
              {anesthesiaData?.length > 0 ? (
                anesthesiaData.map((option) => {
                  return (
                    <div key={option.id} className="text-sm py-1 px-2 hover:bg-muted rounded-sm">
                      {option?.name}
                    </div>
                  )
                })
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
                  Дата байхгүй
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <div className="flex-1">
          <div className="h-8 flex items-center justify-between mb-2">
            <p className="font-semibold text-sm">Нэмэлт процедур</p>
            <Button
              size="icon"
              className="size-8"
              type="button"
              onClick={() => {
                setSelectedType('procedureType')
                setIsOpenCreateModal(true)
                setTitle('Нэмэлт процедур бүртгэх')
              }}
            >
              <LuPlus />
            </Button>
          </div>
          <div className="border rounded-lg py-2">
            <ScrollArea className="h-[200px] w-full px-2">
              {procedureData?.length > 0 ? (
                procedureData.map((option) => {
                  return (
                    <div key={option.id} className="text-sm py-1 px-2 hover:bg-muted rounded-sm">
                      {option?.name}
                    </div>
                  )
                })
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
                  Дата байхгүй
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>

      {isOpenUpdateModal && (
        <UpdateOptionModal
          open={isOpenUpdateModal}
          title="Үзлэгийн төрөл засах"
          data={selectedTypeData}
          onHide={() => {
            setIsOpenUpdateModal(false)
          }}
          onSuccess={getAllOptions}
        />
      )}

      {isOpenCreateModal && (
        <CreateOptionModal
          open={isOpenCreateModal}
          title={title}
          type={selectedType}
          onHide={() => {
            setIsOpenCreateModal(false)
          }}
          onSuccess={getAllOptions}
        />
      )}
    </div>
  )
}

export default InspectionSettings
