import { Separator } from '../../ui/seperator'
import { BsCameraReelsFill } from 'react-icons/bs'
import { FaFileVideo } from 'react-icons/fa6'
import VideoPlayer from '../../video/VideoPlayer'
import VideoRecorder from '../../video/VideoRecorder'
import { useNewData } from '../../../context/new-data-context'
import { toast } from 'sonner'
import { RxArrowLeft, RxReload } from 'react-icons/rx'
import { Button } from '../../ui/Button'
import ImagesComponent from './ImagesComponent'
import { v4 as uuidv4 } from 'uuid'
import { defaultLowerSlotsData, defaultUpperSlotsData } from '../../../lib/staticData'
import { DndContext } from '@dnd-kit/core'
import DraggableImage from '../../dnd/draggable-image'
import DraggableOverlay from '../../dnd/draggable-overlay'

const ChooseVideoSrcType = ({ onChange = () => {}, setVideoSrc = () => {} }) => {
  return (
    <div className="w-full aspect-[4/3] bg-white/20 flex items-center justify-center">
      <div className="w-fit flex flex-col items-center gap-4 ">
        <button
          type="button"
          className="border rounded-full flex gap-2 px-4 py-2 text-white hover:bg-black/20"
          onClick={async () => {
            onChange('record')
          }}
        >
          <BsCameraReelsFill className="text-white text-[24px]" />
          Record
        </button>
        <div className="w-[100px] flex items-center gap-2 justify-center text-muted-foreground">
          <Separator className="bg-muted-foreground" />
          or
          <Separator className="bg-muted-foreground" />
        </div>
        <button
          type="button"
          className="border rounded-lg flex gap-2 p-2 text-white hover:bg-black/20"
          onClick={async () => {
            onChange('chooseFile')
            setVideoSrc()
          }}
        >
          <FaFileVideo className="text-white text-[24px]" />
          Файл сонгох
        </button>
      </div>
    </div>
  )
}

const MediaInformation = ({ prevStep = () => {}, type = 'upper' }) => {
  const { changeNewData, newData } = useNewData()

  const defaultSlots = type === 'upper' ? defaultUpperSlotsData : defaultLowerSlotsData
  const mainSlots = defaultSlots.slice(0, 9)

  let ti = newData?.tempImages
  if (ti && ti.length > 0) {
    if (ti[0].type !== type) {
      ti = mainSlots
    }
  } else {
    ti = mainSlots
  }

  const slots = ti?.sort((a, b) => a.orderIndex - b.orderIndex)

  const onEnd = (filePath) => {
    changeNewData({
      tempVideoPath: filePath
    })
  }

  const selectVideoFile = async () => {
    const latestSelectPath = localStorage.getItem('latestFilePath')
    const selectedFile = await window.electron.ipcRenderer.invoke('dialog:openFile', {
      path: latestSelectPath,
      filters: [{ name: 'Videos', extensions: ['mp4', 'webm'] }]
    })

    localStorage.setItem('latestFilePath', selectedFile.folder)

    changeNewData({
      tempVideoPath: selectedFile.path
    })
  }

  // Huuchin
  // const onCaptureImage = async (imageURL) => {
  //   const res = await window.api.saveImageFile(imageURL, newData.uuid)
  //   if (res?.result) {
  //     const foundIndex = slots?.findIndex((item) => !item?.path)
  //     updateItem(foundIndex, res?.data?.path)
  //   } else {
  //     toast.error('Амжилтгүй', {
  //       action: {
  //         label: 'Хаах',
  //         onClick: () => {}
  //       },
  //       duration: 3000,
  //       richColors: true,
  //       description: res?.message || 'Алдаа гарлаа'
  //     })
  //   }
  // }

  const onCaptureImage = async (imageURL) => {
    const res = await window.api.saveImageFile(imageURL, newData.uuid)
    if (res?.result) {
      addImage(res?.data?.path)
    } else {
      toast.error('Амжилтгүй', {
        action: {
          label: 'Хаах',
          onClick: () => {}
        },
        duration: 3000,
        richColors: true,
        description: res?.message || 'Алдаа гарлаа'
      })
    }
  }

  const resetVideo = async () => {
    changeNewData({
      tempImages: [],
      images: [],
      tempVideoPath: undefined,
      sourceType: undefined
    })
    await window.api.removeTempFiles(newData.uuid)
  }

  const removeItem = async (slotIndex) => {
    let images = [...slots]
    images[slotIndex].path = undefined

    changeNewData({
      tempImages: images
    })

    await window.api.removeImageFile()
  }

  // Update an item in a specific slot
  const updateItem = (slotIndex, newData) => {
    let images = [...slots]
    images[slotIndex] = {
      ...images[slotIndex],
      ...newData
    }
    changeNewData({
      tempImages: images
    })
  }

  // Add item
  const addImage = (newPath) => {
    const images = [...(newData?.images || [])]
    images.push({
      path: newPath
    })
    changeNewData({
      images
    })
  }

  // Add item
  const removeImage = (index) => {
    let slotImages = [...slots]
    const images = [...newData.images]
    const removedImage = images.splice(index, 1)
    const removedSlots = slotImages.map((item) => {
      if (item.path === removedImage[0]?.path) {
        return {
          ...item,
          position: item.orderIndex,
          path: undefined
        }
      }
      return item
    })
    changeNewData({
      images,
      tempImages: removedSlots
    })
  }

  // Swap items between two slots
  const moveItem = (fromIndex, toIndex) => {
    let images = [...slots]
    const temp = slots[fromIndex].path
    images[toIndex].path = temp
    images[fromIndex].path = undefined
    changeNewData({
      tempImages: images
    })
  }

  const videoPath = newData?.tempVideoPath
  const selectedType = newData?.sourceType

  return (
    <div className="mb-14 h-[calc(100vh-280px)] overflow-hidden flex flex-col gap-4">
      <DndContext>
        <form className="w-full grid grid-cols-[400px_1fr] 2xl:grid-cols-[654px_1fr] gap-4 h-[300px] 2xl:h-[491px]">
          <div className="w-full">
            <div className="relative bg-black w-full">
              {(!selectedType || (selectedType === 'chooseFile' && !videoPath)) && (
                <ChooseVideoSrcType
                  onChange={(type) => {
                    changeNewData({
                      sourceType: type
                    })
                  }}
                  setVideoSrc={selectVideoFile}
                />
              )}
              {videoPath && (
                <VideoPlayer
                  src={videoPath}
                  reRecord={async () => {
                    changeNewData({
                      tempVideoPath: undefined,
                      sourceType: undefined
                    })
                  }}
                  onCaptureImage={onCaptureImage}
                  type={selectedType}
                />
              )}
              {!videoPath && selectedType === 'record' && (
                <VideoRecorder
                  key={uuidv4()}
                  onEnd={onEnd}
                  back={() => {
                    changeNewData({
                      sourceType: undefined
                    })
                  }}
                />
              )}
            </div>
          </div>
          {/* <div className="flex-1 lg:flex-auto lg:w-[00px] select-none pointer-events-none">
          <img
            src={type === 'upper' ? upperImage : lowerImage}
            className="w-full lg:w-[500px] object-contain"
          />
        </div> */}
          <ImagesComponent
            defaultSlots={defaultSlots}
            images={slots}
            removeItem={removeItem}
            updateItem={updateItem}
            moveItem={moveItem}
          />
        </form>
        <div className="overflow-y-hidden overflow-x-auto w-full">
          <div className="flex gap-2 min-w-max">
            {newData?.images?.map((item, index) => {
              return (
                <div key={index} className="w-[180px] 2xl:w-[220px]">
                  <DraggableImage item={item} index={index} onRemove={removeImage} />
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-4 justify-between fixed left-0 right-0 bottom-[53px] border-t z-10 bg-background px-4 py-2">
          <div className="flex gap-4">
            <Button variant="secondary" onClick={prevStep}>
              <RxArrowLeft className="me-2" />
              Буцах
            </Button>
            <Button variant="secondary" onClick={resetVideo} disabled={!videoPath}>
              <RxReload className="me-2" />
              Шинээр эхлэх
            </Button>
          </div>

          <div className="flex gap-4">
            <Button
              disabled={
                !newData?.tempVideoPath || slots?.filter((item) => item?.path)?.length === 0
              }
              onClick={prevStep}
            >
              Хадгалах
            </Button>
          </div>
        </div>
        <DraggableOverlay />
      </DndContext>
    </div>
  )
}

export default MediaInformation
