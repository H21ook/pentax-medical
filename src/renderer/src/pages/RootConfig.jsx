import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import AdminRegistration from '../components/root-config/AdminRegistration'
import logoImage from '../assets/logo.svg'

import 'swiper/css'
import 'swiper/css/pagination'
import './root-config.css'
import HospitalRegistration from '../components/root-config/HospitalRegistration'
import DataRootRegistration from '../components/root-config/DataRootRegistration'

const SliderFooter = ({ pageCount, pageIndex }) => {
  return (
    <div className="w-[100px] flex gap-2">
      {Array(pageCount)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${pageIndex === index ? 'bg-primary' : 'bg-primary/10'}`}
          ></div>
        ))}
    </div>
  )
}

const RootConfigPage = () => {
  const [pageIndex, setPageIndex] = useState(0)

  return (
    <div className="w-full h-full bg-vite-bg bg-no-repeat bg-cover">
      <div className="absolute w-full top-0 p-8 flex items-start justify-between">
        <img src={logoImage} alt="pentax medical logo" className="h-12" />
      </div>
      <div className="relative h-full">
        <Swiper
          modules={[Navigation, Pagination]}
          allowTouchMove={false}
          preventClicksPropagation={true}
        >
          <SwiperSlide
            style={{
              background: 'transparent'
            }}
          >
            <AdminRegistration changePage={setPageIndex} />
          </SwiperSlide>
          <SwiperSlide
            style={{
              background: 'transparent'
            }}
          >
            <HospitalRegistration changePage={setPageIndex} />
          </SwiperSlide>
          <SwiperSlide
            style={{
              background: 'transparent'
            }}
          >
            <DataRootRegistration />
          </SwiperSlide>
          <div className="absolute bottom-0 z-[1] flex justify-center w-full py-4">
            <SliderFooter pageCount={3} pageIndex={pageIndex} />
          </div>
        </Swiper>
      </div>
    </div>
  )
}

export default RootConfigPage
