import { Button } from '../components/ui/Button'
import logoImage from '../assets/logo.svg'
import deviceImage from '../assets/device_front.webp'
import closeIcon from '../assets/icons/close.png'
import { useRouter } from '../context/page-router'

const GetStartedPage = () => {
  const router = useRouter()
  return (
    <div className="h-full flex flex-col items-center justify-center bg-vite-bg bg-no-repeat bg-cover">
      <div className="absolute w-full top-0 p-8 flex items-start justify-between">
        <img src={logoImage} alt="pentax medical logo" className="h-12" />
        <div
          className="group h-8 w-8 transition-all duration-300 border border-black hover:border-dimmed rounded-full cursor-pointer flex items-center justify-center bg-transparent hover:bg-primary"
          onClick={() => {
            window.electron.ipcRenderer.send('close')
          }}
        >
          <img
            alt="close"
            src={closeIcon}
            className="h-6 w-6 transition-all duration-300 group-hover:invert"
          />
        </div>
      </div>
      <div className="flex mb-8 w-[500px] text-center flex-col items-center">
        <img src={deviceImage} alt="pentax medical logo" className="h-24" />
        <h1 className="font-bold text-[40px]">Сайн байна уу</h1>
        <p>Пентакс медикал дурангийн програмд тавтай морил уу.</p>
      </div>
      <Button
        className="animate-bounce"
        onClick={() => {
          router.push('root-config')
        }}
      >
        Эхлэх
      </Button>
    </div>
  )
}

export default GetStartedPage
