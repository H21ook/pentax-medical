import { useState } from 'react'
import { Separator } from '../../ui/seperator'
import { BsCameraReelsFill } from 'react-icons/bs'
import { FaFileVideo } from 'react-icons/fa6'
import VideoPlayer from '../../video/VideoPlayer'
import VideoRecorder from '../../video/VideoRecorder'

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

const MediaInformation = () => {
  const [selectedType, setSelectedType] = useState()
  const [videoPath, setVideoPath] = useState()

  const onEnd = (filePath) => {
    setVideoPath(filePath)
  }

  const selectVideoFile = async () => {
    const selectedFile = await window.electron.ipcRenderer.invoke('dialog:openFile', [
      { name: 'Videos', extensions: ['mp4', 'avi', 'mkv', 'mov'] }
    ])
    console.log(selectedFile)
    setVideoPath(selectedFile)
    setSelectedType('chooseFile')
  }

  return (
    <form className="w-full bg-red-300 flex gap-10">
      <div className="w-[70%] lg:w-[40%]">
        <div className="relative bg-black w-full">
          {(!selectedType || (selectedType === 'chooseFile' && !videoPath)) && (
            <ChooseVideoSrcType
              onChange={(type) => {
                setSelectedType(type)
              }}
              setVideoSrc={selectVideoFile}
            />
          )}
          {videoPath && (
            <VideoPlayer
              src={videoPath}
              reRecord={async () => {
                setVideoPath(undefined)
                setSelectedType(undefined)
              }}
              type={selectedType}
            />
          )}
          {!videoPath && selectedType === 'record' && <VideoRecorder onEnd={onEnd} />}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="w-full aspect-video bg-black/50 rounded-md">1</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">2</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">3</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">4</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">5</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">6</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">7</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">8</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">9</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">10</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">11</div>
        <div className="w-full aspect-video bg-black/50 rounded-md">12</div>
      </div>
    </form>
  )
}

export default MediaInformation
