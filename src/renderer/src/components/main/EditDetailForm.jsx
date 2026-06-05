import ImagesComponent from './new-tab/ImagesComponent'
import { defaultLowerSlotsData, defaultUpperSlotsData } from '../../lib/staticData'
import { useEffect, useState } from 'react'
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
  let rawImagesInitial = employeeData?.images?.filter((item) => item.type === 'raw')

  if (tempImages?.length < 9) {
    tempImages = [...tempImages, ...defaultSlots.slice(tempImages?.length || 0, 9)]
  }
  tempImages?.sort((a, b) => a.orderIndex - b.orderIndex)

  const [slots, setSlots] = useState(JSON.parse(JSON.stringify(tempImages)))
  const [rawImages, setRawImages] = useState(rawImagesInitial)
  const [summary, setSummary] = useState(employeeData?.summary)
  const [loading, setLoading] = useState(false)
  const [recoverLoading, setRecoverLoading] = useState(false)

  useEffect(() => {
    const nextTempImages = employeeData?.images?.filter((item) => item.type === 'selected') || []
    const nextRawImages = employeeData?.images?.filter((item) => item.type === 'raw') || []

    let nextSlots = nextTempImages
    if (nextSlots?.length < 9) {
      nextSlots = [...nextSlots, ...defaultSlots.slice(nextSlots.length, 9)]
    }
    nextSlots?.sort((a, b) => a.orderIndex - b.orderIndex)

    setSlots(JSON.parse(JSON.stringify(nextSlots)))
    setRawImages(nextRawImages)
    setSummary(employeeData?.summary)
  }, [defaultSlots, employeeData?.images, employeeData?.summary])

  const handleRecover = async () => {
    setRecoverLoading(true)
    try {
      const res = await window.api.recoverEmployeeImages({
        id: employeeData?.id,
        uuid: employeeData?.uuid
      })

      if (res?.result) {
        toast.success('Амжилттай', {
          action: {
            label: 'Хаах',
            onClick: () => {}
          },
          duration: 3000,
          richColors: true,
          description: 'Зураг сэргээгдлээ'
        })
        await onSuccess()
        return
      }

      toast.error('Амжилтгүй', {
        action: {
          label: 'Хаах',
          onClick: () => {}
        },
        duration: 3000,
        richColors: true,
        description: res?.message || 'Файл олдсонгүй'
      })
    } catch (err) {
      toast.error('Амжилтгүй', {
        action: {
          label: 'Хаах',
          onClick: () => {}
        },
        duration: 3000,
        richColors: true,
        description: err?.message || 'Сэргээх үед алдаа гарлаа'
      })
    } finally {
      setRecoverLoading(false)
    }
  }

  const removeItem = async (slotIndex) => {
    setSlots((prevSlot) => {
      const images = [...prevSlot]
      images[slotIndex].path = undefined
      images[slotIndex].edited = true
      images[slotIndex].deleted = true
      return images
    })
  }

  const updateItem = (slotIndex, newData) => {
    setSlots((prevSlot) => {
      const images = [...prevSlot]
      images[slotIndex] = {
        ...images[slotIndex],
        ...newData,
        deleted: false
      }
      images[slotIndex].edited = true
      return images
    })
  }

  const moveItem = (fromIndex, toIndex) => {
    setSlots((prevSlot) => {
      const images = [...prevSlot]
      const temp = prevSlot[fromIndex].path
      const targetSlot = defaultSlots.find((s) => s.orderIndex === toIndex + 1)
      images[toIndex].path = temp
      images[toIndex].orderIndex = toIndex + 1
      images[toIndex].position = toIndex + 1
      images[toIndex].name = targetSlot?.name || images[toIndex].name
      images[toIndex].type = 'selected'
      images[fromIndex].path = undefined
      images[fromIndex].deleted = true
      images[fromIndex].type = 'selected'
      images[toIndex].edited = true
      images[fromIndex].edited = true
      return images
    })
  }

  const removeImage = (index) => {
    const images = [...rawImages]
    const removedImage = images.splice(index, 1)
    setSlots((prevSlot) => {
      const slotImages = [...prevSlot]
      const removedSlots = slotImages.map((item) => {
        if (item.path === removedImage[0]?.path) {
          return {
            ...item,
            position: item.orderIndex,
            edited: true,
            deleted: true,
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
        {employeeData?.recoveryState?.needsRecovery ? (
          <div className="flex items-center justify-between rounded-md border border-orange-500 bg-orange-500/20 p-3 mt-6">
            <div className="text-sm text-muted-foreground">
              Зургууд дутуу байна уу?. Түр зуурын дата устгаагүй байвал сэргээх боломжтой.
            </div>
            <Button onClick={handleRecover} disabled={recoverLoading}>
              {recoverLoading ? 'Сэргээж байна...' : 'Зураг сэргээх'}
            </Button>
          </div>
        ) : null}
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
