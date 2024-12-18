import { useCallback, useEffect, useState } from 'react'
import styles from './index.module.css'
import lowerImage from '../../assets/lower.png'
import upperImage from '../../assets/upper.png'
import { useAddress } from '../../context/address-context'
import { useUsers } from '../../context/users-context'

const PrintPage = () => {
  const { parentAddress, allAddressData } = useAddress()
  const { users } = useUsers()
  const [employeeData, setEmployeeData] = useState()

  const getDetailEmployee = useCallback(async (_id) => {
    const res = await window.api.getEmployee(_id)
    setEmployeeData(res)
    window.api.print({
      uuid: res?.uuid,
      createdDate: res?.createdAt
    })
  }, [])

  useEffect(() => {
    const printUserId = localStorage.getItem('printUser')
    if (printUserId) {
      getDetailEmployee(printUserId)
    } else {
      window.electron.ipcRenderer.send('close-print')
    }
    return () => {
      window.electron.ipcRenderer.removeAllListeners('print-user')
    }
  }, [])

  const employeeParentAddress = parentAddress?.find((item) => item.id === employeeData?.cityId)
  const employeeSubAddress = allAddressData?.find((item) => item.id === employeeData?.districtId)

  const doctor = users.find((u) => u.id === employeeData?.doctorId)
  const nurse = users.find((u) => u.id === employeeData?.nurseId)

  return (
    <div className="h-full overflow-y-auto">
      <div className={`title ${styles.title}`}>Сүхбаатар дүүргийн эрүүл мэндийн төв</div>
      <div className="m-5">
        <div className={`wrapper ${styles.wrapper}`}>
          <div>
            {/* <div>
                <h3 className={`header ${styles.header}`}>Ерөнхий мэдээлэл</h3>
              </div> */}
            <div className={`gridWrapper ${styles.gridWrapper}`}>
              <div>
                <div className={`subGrid ${styles.subGrid}`}>
                  <div>Нэр:</div>
                  <div>
                    {employeeData?.lastName?.[0]}. {employeeData?.firstName}
                  </div>

                  <div>Регистрийн дугаар:</div>
                  <div>{employeeData?.regNo}</div>

                  <div>Төгсөн огноо:</div>
                  <div>{employeeData?.birthDate}</div>

                  <div>Нас:</div>
                  <div>{employeeData?.age}</div>

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
                  <div>Эмнэлгийн нэр:</div>
                  <div>{employeeData?.hospitalName}</div>

                  <div>Тасгийн нэр:</div>
                  <div>{employeeData?.departmentName}</div>

                  <div>Заалт:</div>
                  <div>{employeeData?.diseaseIndication}</div>

                  <div>Мэдээ алдууулалт:</div>
                  <div>{employeeData?.anesthesia}%</div>

                  <div>Үзлэгийн огноо:</div>
                  <div>{employeeData?.date}</div>

                  <div>Үзлэгийн төрөл:</div>
                  <div>{employeeData?.type === 'lower' ? 'Lower Gi' : 'Upper Gi'}</div>

                  <div>Эмч:</div>
                  <div>{doctor?.displayName}</div>

                  <div>Сувилагч:</div>
                  <div>{nurse?.displayName}</div>

                  <div>Онош:</div>
                  <div>{employeeData?.diagnosis}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`imageWrapper ${styles.imageWrapper}`}>
            {employeeData?.images?.map((imageData) => {
              return (
                <div key={imageData.id} className={`imageContainer ${styles.imageContainer}`}>
                  <div className={`imageTitleWrapper ${styles.imageTitleWrapper}`}>
                    <div className={`imageNumber ${styles.imageNumber}`}>
                      {imageData.orderIndex}
                    </div>
                    <div className={`imageName ${styles.imageName}`}>{imageData.name}</div>
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
            <div className={`information ${styles.information}`}>
              <p>Дүгнэлт:</p>
              <div className={`summary ${styles.summary}`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: employeeData?.summary
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end text-xs">
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
    </div>
  )
}

export default PrintPage
