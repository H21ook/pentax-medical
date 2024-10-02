import { AiOutlineLoading } from 'react-icons/ai'

const LoaderPage = () => {
  return (
    <div>
      <div className="relative h-screen w-full flex flex-col items-center bg-vite-bg justify-center bg-no-repeat bg-cover">
        <div className="flex gap-2">
          <AiOutlineLoading size={24} className="animate-spin" />
          <p className="text-lg text-dimmed">Уншиж байна...</p>
        </div>
      </div>
    </div>
  )
}

export default LoaderPage
