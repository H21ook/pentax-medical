import ImagesComponent from './new-tab/ImagesComponent'
import { defaultLowerSlotsData, defaultUpperSlotsData } from '../../lib/staticData'
import { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import DraggableImage from '../dnd/draggable-image'
import DraggableOverlay from '../dnd/draggable-overlay'
import Editor from '../ui/Editor'
import { Label } from '../ui/Label'
import { Button } from '../ui/Button'
import { toast } from 'sonner'

const EditDetailForm = ({ employeeData, onHide = () => {}, onSuccess = () => {} }) => {
  const defaultSlots =
    employeeData?.type === 'upper' ? defaultUpperSlotsData : defaultLowerSlotsData

  let tempImages = employeeData?.images?.filter((item) => item.type === 'selected')
  let raw_images = employeeData?.images?.filter((item) => item.type === 'raw')

  if (tempImages?.length < 9) {
    tempImages = [...tempImages, ...defaultSlots.slice(tempImages?.length || 0, 9)]
  }
  tempImages?.sort((a, b) => a.orderIndex - b.orderIndex)
  const [slots, setSlots] = useState(JSON.parse(JSON.stringify(tempImages)))
  const [rawImages, setRawImages] = useState(raw_images)
  const [summary, setSummary] = useState(employeeData?.summary)
  const [loading, setLoading] = useState(false)

  const removeItem = async (slotIndex) => {
    setSlots((prevSlot) => {
      let images = [...prevSlot]
      images[slotIndex].path = undefined
      images[slotIndex].edited = true
      images[slotIndex].imageChanged = true
      return images
    })
  }

  const updateItem = (slotIndex, newData) => {
    setSlots((prevSlot) => {
      let images = [...prevSlot]
      images[slotIndex] = {
        ...images[slotIndex],
        ...newData
      }
      images[slotIndex].edited = true
      return images
    })
  }

  const moveItem = (fromIndex, toIndex) => {
    setSlots((prevSlot) => {
      let images = [...prevSlot]
      const temp = prevSlot[fromIndex].path
      images[toIndex].path = temp
      images[fromIndex].path = undefined
      images[toIndex].edited = true
      images[fromIndex].edited = true
      return images
    })
  }

  const removeImage = (index) => {
    const images = [...rawImages]
    const removedImage = images.splice(index, 1)
    setSlots((prevSlot) => {
      let slotImages = [...prevSlot]
      const removedSlots = slotImages.map((item) => {
        if (item.path === removedImage[0]?.path) {
          return {
            ...item,
            position: item.orderIndex,
            edited: true,
            imageChanged: true,
            path: undefined
          }
        }
        return item
      })
      return removedSlots
    })
    setRawImages(images)
  }

  const save = async () => {
    setLoading(true)
    try {
      const res = await window.api.updateEmployee({
        images: slots.filter((item) => item?.edited),
        summary,
        id: employeeData?.id,
        uuid: employeeData.uuid
      })

      if (res?.result) {
        toast.success('Амжилттай', {
          action: {
            label: 'Хаах',
            onClick: () => {}
          },
          duration: 3000,
          richColors: true,
          description: 'Мэдээлэл амжилттай засварлагдлаа'
        })
        onSuccess()
        onHide()
      }
    } catch (err) {
      toast.error('Амжилтгүй', {
        action: {
          label: 'Хаах',
          onClick: () => {}
        },
        duration: 3000,
        richColors: true,
        description: err?.message || 'Мэдээлэл засахад алдаа гарлаа'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <DndContext>
        <div className="flex flex-col gap-1 items-start mb-6">
          <Label htmlFor={name} className="pb-1">
            Дүгнэлт <span className="text-red-500">*</span>
          </Label>

          <Editor
            id={'summary'}
            placeholder="Дүгнэлт"
            value={summary}
            onChange={(e) => {
              setSummary(e)
            }}
          />
        </div>
        <ImagesComponent
          defaultSlots={defaultSlots}
          images={slots || defaultSlots.splice(0, 9)}
          removeItem={removeItem}
          updateItem={updateItem}
          moveItem={moveItem}
        />
        <div className="overflow-y-hidden overflow-x-auto w-full mt-6">
          <div className="flex gap-2 min-w-max">
            {rawImages?.map((item, index) => {
              return (
                <div key={index} className="w-[180px] 2xl:w-[220px]">
                  <DraggableImage
                    item={item}
                    index={index}
                    onRemove={removeImage}
                    deletable={false}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <DraggableOverlay />
      </DndContext>
      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="secondary" onClick={onHide}>
          Буцах
        </Button>
        <Button onClick={save} disabled={loading}>
          Хадгалах
        </Button>
      </div>
    </div>
  )
}

export default EditDetailForm
