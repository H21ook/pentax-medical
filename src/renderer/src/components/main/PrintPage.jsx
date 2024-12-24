import { useEffect, useState } from 'react'
import styles from './index.module.css'
import lowerImage from '../../assets/lower.png'
import upperImage from '../../assets/upper.png'
import { calculateAgeFromRegister } from '../../lib/utils'
import { useOptions } from '../../context/options-context'
import { useHospital } from '../../context/hospital-context'

const PrintPage = () => {
  const { allOptions } = useOptions()
  const { hospitalData } = useHospital()
  const [printData, setPrintData] = useState()

  useEffect(() => {
    const printData = localStorage.getItem('printData')
    if (printData) {
      setPrintData(JSON.parse(printData))
    }
  }, [])

  const inspectionData = allOptions?.filter((item) => item.type === 'inspectionType')
  const scopeData = allOptions?.filter((item) => item.type === 'scopeType')
  const procedureData = allOptions?.filter((item) => item.type === 'procedureType')

  const employeeData = printData?.employeeData
  const employeeParentAddress = printData?.employeeParentAddress
  const employeeSubAddress = printData?.employeeSubAddress
  const doctor = printData?.doctor
  const nurse = printData?.nurse

  const selectedType = inspectionData.find((item) => item.value === employeeData?.type)
  const selectedScope = scopeData.find((item) => item.value === employeeData?.scopeType)
  const selectedProcedure = procedureData.find((item) => item.value === employeeData?.procedure)
  const reportAllImages =
    employeeData?.images?.filter((item) => item.type === 'selected' && item?.path) || []
  const selectedImages =
    reportAllImages?.length > 9 ? reportAllImages.splice(0, 9) : reportAllImages

  const info = calculateAgeFromRegister(employeeData?.regNo)

  return (
    <div>
      <div className={`mb-8 w-full text-center font-semibold`}>{employeeData?.hospitalName}</div>
      <div className="m-5 border border-black">
        <div className={`wrapper ${styles.wrapper}`}>
          <div>
            {/* <div>
                <h3 className={`header ${styles.header}`}>Ерөнхий мэдээлэл</h3>
              </div> */}
            <div className={`px-4 m-4 ${styles.gridWrapper}`}>
              <div>
                <div className={`subGrid ${styles.subGrid}`}>
                  <div>№:</div>
                  <div>{employeeData?.id}</div>

                  <div>Нэр:</div>
                  <div>
                    {employeeData?.firstName?.[0]}. {employeeData?.lastName}
                  </div>

                  <div>Регистрийн дугаар:</div>
                  <div>{employeeData?.regNo}</div>

                  <div>Төгсөн огноо:</div>
                  <div>{info?.birthDate}</div>

                  <div>Нас:</div>
                  <div>{info?.age}</div>

                  <div>Хүйс:</div>
                  <div>
                    {employeeData?.gender === 'male'
                      ? 'Эр'
                      : employeeData?.gender === 'female'
                        ? 'Эм'
                        : 'Бусад'}
                  </div>
                  <div>Хаяг:</div>
                  <div>
                    {employeeParentAddress?.name}, {employeeSubAddress?.name},{' '}
                    {employeeData?.address}
                  </div>

                  <div>Утасны дугаар:</div>
                  <div>{employeeData?.phoneNumber}</div>
                </div>
              </div>
              <div>
                <div className={`subGrid ${styles.subGrid}`}>
                  <div>Тасгийн нэр:</div>
                  <div>{employeeData?.departmentName}</div>

                  <div>Дурангийн төрөл:</div>
                  <div>{selectedScope?.name}</div>

                  <div>Үзлэгийн нэр:</div>
                  <div>{selectedType?.name}</div>

                  <div>Үзлэгийн огноо:</div>
                  <div>{employeeData?.date}</div>

                  <div>Заалт:</div>
                  <div>{employeeData?.diseaseIndication}</div>

                  <div>Нэмэлт процедур:</div>
                  <div>{selectedProcedure?.name}</div>

                  <div>Мэдээ алдууулалт:</div>
                  <div>{employeeData?.anesthesia}</div>

                  {nurse && (
                    <>
                      <div>Сувилагч:</div>
                      <div>{nurse?.displayName}</div>
                    </>
                  )}

                  <div>Онош:</div>
                  <div>{employeeData?.diagnosis}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`imageWrapper ${styles.imageWrapper}`}>
            {selectedImages?.map((imageData) => {
              return (
                <div key={imageData.id} className={`imageContainer ${styles.imageContainer}`}>
                  <div className={`imageTitleWrapper ${styles.imageTitleWrapper}`}>
                    <div className={`imageNumber ${styles.imageNumber}`}>{imageData.position}</div>
                    {/* <div className={`imageName ${styles.imageName}`}>{imageData.name}</div> */}
                  </div>
                  <img src={imageData?.path} alt={imageData.name} className="image" />
                </div>
              )
            })}
          </div>

          <div className={`footerWrapper ${styles.footerWrapper}`}>
            <img
              src={employeeData?.type === 'upper' ? upperImage : lowerImage}
              className={`typeImage ${styles.typeImage} ms-1`}
            />
            <div className={`me-4 ${styles.information}`}>
              <b>Дүгнэлт:</b>
              <div className={`m-0 p-0 text-xs !leading-[14px]`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: employeeData?.summary
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start justify-between text-xs m-5 mt-0">
        <div className="flex-1 flex flex-col">
          {hospitalData?.address ? <div>Хаяг: {hospitalData.address}</div> : ''}
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-[150px]">
            <div>Эмч:</div>
            <div>Гарын үсэг:</div>
          </div>
          <div className="flex flex-col w-fit">
            <div>{doctor?.displayName}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintPage
