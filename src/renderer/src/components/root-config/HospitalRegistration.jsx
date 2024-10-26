import animationJson from '../../assets/animation5.json'
import Lottie from 'lottie-react'
import { useSwiper } from 'swiper/react'
import HospitalCreateForm from '../hospital-create-form'

const HospitalRegistration = ({ changePage = () => {} }) => {
  const swiper = useSwiper()
  return (
    <div className="flex h-full items-center">
      <div className="w-[360px] flex justify-center">
        <div className="w-[300px]">
          <Lottie animationData={animationJson} />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-start justify-between pe-8 py-12">
        <div className="flex flex-col items-start">
          <p className="font-bold text-2xl mb-2">Эмнэлгийн мэдээлэл оруулах</p>
          <p className="text-dimmed text-start text-sm">
            Та доорх мэдээллийг бүрэн гүйцэт үнэн зөв оруулна уу. Тус мэдээлэл нь энэхүү программаас
            гарах тайлан, мэдээллүүдэд хэрэглэгдэх юм.
          </p>
          <HospitalCreateForm
            onSuccess={() => {
              changePage(2)
              swiper.slideNext()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default HospitalRegistration
