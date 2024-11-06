import { Button } from '../ui/Button'
import {
  TbCaptureFilled,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerStopFilled,
  TbReload
} from 'react-icons/tb'
import { useRef, useState } from 'react'
import { useNewData } from '../../context/new-data-context'

const VideoPlayer = ({ src, reRecord = () => {} }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const { newData } = useNewData()
  const [duration, setDuration] = useState()
  const [currentTime, setCurrentTime] = useState(0)
  const [isEnded, setIsEnded] = useState(false)

  // Update current time as video plays
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime)
  }

  // Seek to a specific time in the video
  const handleSeek = (event) => {
    if (duration) {
      const newTime = (event.target.value / 100) * (duration || 0)
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        if (isEnded) {
          setIsEnded(false)
          setCurrentTime(0)
        }
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause() // Pause the video
      videoRef.current.currentTime = 0 // Optionally reset to start
      setCurrentTime(0)
      setIsPlaying(false) // Update playing state
      setIsEnded(true) // Reset ended state
    }
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
    setCurrentTime(duration)
    setIsEnded(true)
  }

  const captureImage = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // Set canvas size to match the video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Optionally, you can convert the canvas to a data URL to use the image
    const imageURL = canvas.toDataURL('image/png')
    const res = await window.api.saveImageFile(imageURL, newData.uuid)
    console.log('image ', res)
  }

  return (
    <div className="relative">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnd} // Add the onEnded event
          onTimeUpdate={handleTimeUpdate}
          className="w-full aspect-[4/3] object-cover"
        />
      ) : (
        <div className="w-full aspect-[4/3]"></div>
      )}
      <canvas ref={canvasRef} hidden />
      <div className="absolute bottom-0 w-full flex gap-2 p-2 flex-col">
        <div className="flex gap-2">
          <div className="text-white">
            {Math.floor(currentTime / 60)}:
            {Math.floor(currentTime % 60)
              .toString()
              .padStart(2, '0')}
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime * 100) / duration}
            onChange={handleSeek}
            style={{ flex: '1' }}
          />
          {duration && (
            <div className="text-white">
              {Math.floor(duration / 60)}:
              {Math.floor(duration % 60)
                .toString()
                .padStart(2, '0')}
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-between items-center">
          <Button size="icon" variant="outline" className="rounded-full" onClick={reRecord}>
            <TbReload className="text-[#333]" size={20} />
          </Button>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <TbPlayerPauseFilled className="text-[#333]" size={20} />
              ) : (
                <TbPlayerPlayFilled className="text-[#333]" size={20} />
              )}
            </Button>
            <Button size="icon" variant="outline" className="rounded-full" onClick={handleStop}>
              <TbPlayerStopFilled className="text-[#333]" size={20} />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full" onClick={captureImage}>
              <TbCaptureFilled className="text-[#333]" size={20} />
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
