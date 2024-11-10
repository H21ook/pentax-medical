import { TbArrowLeft, TbPlayerRecordFilled, TbPlayerStopFilled } from 'react-icons/tb'
import { Button } from '../ui/Button'
import { useEffect, useRef, useState } from 'react'
import { Buffer } from 'buffer'
import { useNewData } from '../../context/new-data-context'

const VideoRecorder = ({ onEnd = () => {}, back = () => {} }) => {
  const { newData } = useNewData()
  const videoRef = useRef(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const chunks = useRef([])
  const [recording, setRecording] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState()
  const stream = useRef()
  const [startTime, setStartTime] = useState()

  useEffect(() => {
    const startCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((d) => d.kind === 'videoinput')
        if (videoDevices.length > 0) {
          const currentDevice = videoDevices[0]
          setSelectedDevice(currentDevice)
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: {
                exact: currentDevice.deviceId
              }
            }
          })

          if (videoRef.current) {
            videoRef.current.srcObject = newStream
          }
          stream.current = newStream
          const recorder = new MediaRecorder(newStream)
          setMediaRecorder(recorder)
        }
        // Not found video source
      } catch (err) {
        console.error('Error accessing camera:', err)
      }
    }

    startCamera()

    // Clean up the stream when the component unmounts
    return () => {
      if (stream.current) {
        stream.current.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [])

  const startRecording = async () => {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      chunks.current = [] // Clear previous chunks
      mediaRecorder.start()
      setStartTime(Date.now())
      setRecording(true)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data)
        }
      }
    }
  }

  // Stop recording and save the video

  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setRecording(false)
      if (stream.current) {
        stream.current.getTracks().forEach((track) => {
          track.stop()
        })
      }
      mediaRecorder.onstop = async () => {
        const endTime = Date.now()
        const duration = (endTime - startTime) / 1000
        const blob = new Blob(chunks.current, { type: 'video/webm; codecs=vp9' })
        setStartTime(undefined)

        const arrayBuffer = await blob.arrayBuffer() // Convert Blob to ArrayBuffer
        const buffer = Buffer.from(arrayBuffer)
        const res = await window.api.saveVideoFile(buffer, newData.uuid)
        if (res.result) {
          onEnd(res.data.path, duration)
        }
      }
    }
  }

  return (
    <div className="relative">
      <video ref={videoRef} autoPlay className="w-full aspect-[4/3] object-cover" />
      {selectedDevice ? (
        <div className="absolute top-2 left-2 rounded-md bg-white/50 px-2">
          {selectedDevice.label}
        </div>
      ) : null}

      <div className="absolute bottom-0 w-full flex gap-2 p-2 justify-between">
        <Button size="icon" variant="ghost" className="rounded-full border bg-white" onClick={back}>
          <TbArrowLeft size={20} />
        </Button>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full border bg-white"
            disabled={recording}
            onClick={startRecording}
          >
            <TbPlayerRecordFilled className="text-primary" size={20} />
          </Button>
          <Button
            size="icon"
            className="rounded-full"
            disabled={!recording}
            onClick={stopRecording}
          >
            <TbPlayerStopFilled size={20} />
          </Button>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default VideoRecorder
