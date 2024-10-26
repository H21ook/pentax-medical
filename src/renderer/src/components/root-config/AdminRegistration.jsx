import animationJson from '../../assets/animation1.json'
import Lottie from 'lottie-react'
import AdminCreateForm from '../admin-create-form'
import { useSwiper } from 'swiper/react'

const AdminRegistration = ({ changePage = () => {} }) => {
  const swiper = useSwiper()
  return (
    <div className="flex h-full items-center select-none">
      <div className="w-[360px]">
        <Lottie animationData={animationJson} />
      </div>
      <div className="flex-1 flex flex-col items-start justify-between pe-8 py-12">
        <div className="flex flex-col items-start">
          <p className="font-bold text-2xl mb-2">Програмын админ эрх үүсгэх</p>
          <p className="text-dimmed text-start text-sm">
            Админ эрх нь програмын үндсэн тохиргоог тохируулж, засаж, өөрчлөхөөс гадна ажилтан
            нэмэх, хасах, ажилтны нууц үг сэргээх гэх мэт үйлдлүүдийг хийх боломжтой.
          </p>
          <AdminCreateForm
            onSuccess={() => {
              changePage(1)
              swiper.slideNext()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminRegistration
