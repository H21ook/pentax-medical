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

const defaultSlotsData = [
  {
    orderIndex: 1,
    name: 'Image 1'
  },
  {
    orderIndex: 2,
    name: 'Image 2'
  },
  {
    orderIndex: 3,
    name: 'Image 3'
  },
  {
    orderIndex: 4,
    name: 'Image 4'
  },
  {
    orderIndex: 5,
    name: 'Image 5'
  },
  {
    orderIndex: 6,
    name: 'Image 6'
  },
  {
    orderIndex: 7,
    name: 'Image 7'
  },
  {
    orderIndex: 8,
    name: 'Image 8'
  },
  {
    orderIndex: 9,
    name: 'Image 9'
  },
  {
    orderIndex: 10,
    name: 'Image 10'
  },
  {
    orderIndex: 11,
    name: 'Image 11'
  },
  {
    orderIndex: 12,
    name: 'Image 12'
  }
]

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

const MediaInformation = ({ prevStep = () => {} }) => {
  const { changeNewData, newData } = useNewData()
  const slots = (newData?.tempImages || defaultSlotsData).sort(
    (a, b) => a.orderIndex - b.orderIndex
  )

  const onEnd = (filePath) => {
    changeNewData({
      tempVideoPath: filePath
    })
  }

  const selectVideoFile = async () => {
    const latestSelectPath = localStorage.getItem('latestFilePath')
    const selectedFile = await window.electron.ipcRenderer.invoke('dialog:openFile', {
      path: latestSelectPath,
      filters: [{ name: 'Videos', extensions: ['mp4', 'avi', 'mkv', 'mov'] }]
    })

    localStorage.setItem('latestFilePath', selectedFile.folder)

    changeNewData({
      tempVideoPath: selectedFile.path
    })
  }

  const onCaptureImage = async (imageURL) => {
    const res = await window.api.saveImageFile(imageURL, newData.uuid)
    if (res?.result) {
      const foundIndex = slots?.findIndex((item) => !item?.path)
      updateItem(foundIndex, res?.data?.path)
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
  const updateItem = (slotIndex, newPath) => {
    let images = [...slots]
    images[slotIndex].path = newPath
    changeNewData({
      tempImages: images
    })
  }

  // Swap items between two slots
  const swapItems = (slotIndex1, slotIndex2) => {
    let images = [...slots]
    let temp = images[slotIndex1]
    images[slotIndex1].path = images[slotIndex2].path
    images[slotIndex2].path = temp.path
    changeNewData({
      tempImages: images
    })
  }

  const videoPath = newData?.tempVideoPath
  const selectedType = newData?.sourceType

  return (
    <div>
      <div className="mb-4 flex gap-4 justify-between">
        <Button variant="secondary" onClick={resetVideo} disabled={!videoPath}>
          <RxReload className="me-2" />
          Шинээр эхлэх
        </Button>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={prevStep}>
            <RxArrowLeft className="me-2" />
            Буцах
          </Button>
          <Button
            disabled={!newData?.tempVideoPath || slots.some((item) => !item?.path)}
            onClick={prevStep}
          >
            Хадгалах
          </Button>
        </div>
      </div>
      <form className="w-full flex gap-4 items-start">
        <div className="w-[70%] lg:w-[40%]">
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
        <ImagesComponent
          images={slots}
          removeItem={removeItem}
          updateItem={updateItem}
          swapItems={swapItems}
        />
      </form>
    </div>
  )
}

export default MediaInformation
