import { useCallback, useEffect, useState } from 'react'
import { useNewData } from '../../context/new-data-context'
import { Separator } from '../ui/seperator'
import { useAddress } from '../../context/address-context'
import { useUsers } from '../../context/users-context'
import { Button } from '../ui/Button'
import { RxArrowRight, RxEyeOpen } from 'react-icons/rx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog'

const DetailTab = () => {
  const { tabs, selectedTab } = useNewData()
  const { parentAddress, allAddressData } = useAddress()
  const { users } = useUsers()
  const selectedTabData = tabs[selectedTab]
  const [employeeData, setEmployeeData] = useState()
  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState()

  const getDetailEmployee = useCallback(async (_id) => {
    const res = await window.api.getEmployee(_id)
    setEmployeeData(res)
  }, [])

  useEffect(() => {
    getDetailEmployee(selectedTabData.id)
  }, [getDetailEmployee, selectedTabData])

  const employeeParentAddress = parentAddress?.find((item) => item.id === employeeData?.cityId)
  const employeeSubAddress = allAddressData?.find((item) => item.id === employeeData?.districtId)

  const doctor = users.find((u) => u.id === employeeData?.doctorId)
  const nurse = users.find((u) => u.id === employeeData?.nurseId)

  console.log(employeeData)
  return (
    <div className="space-y-6 px-4">
      <div>
        <h3 className="text-lg font-medium">Ерөнхий мэдээлэл</h3>
      </div>
      <div className="mt-6 grid grid-cols-2">
        <div>
          <div className="grid grid-cols-[200px_1fr] text-sm gap-2">
            <div>Эмнэлгийн нэр</div>
            <b>{employeeData?.hospitalName}</b>

            <div>Тасгийн нэр</div>
            <b>{employeeData?.departmentName}</b>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-[200px_1fr] text-sm gap-2">
            <div>Өвчтөний байдал</div>
            <b>{employeeData?.patientCondition}</b>

            <div>Заалт</div>
            <b>{employeeData?.diseaseIndication}</b>

            <div>Мэдээ алдууулалт</div>
            <b>{employeeData?.anesthesia}%</b>
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium">Өвчтөний мэдээлэл</h3>
      </div>

      <div className="mt-6 grid grid-cols-2">
        <div className="grid grid-cols-[200px_1fr] text-sm gap-2">
          <div>Нэр:</div>
          <b>
            {employeeData?.lastName?.[0]}. {employeeData?.firstName}
          </b>

          <div>Регистрийн дугаар:</div>
          <b>{employeeData?.regNo}</b>

          <div>Төгсөн огноо:</div>
          <b>{employeeData?.birthDate}</b>

          <div>Нас:</div>
          <b>{employeeData?.age}</b>

          <div>Хүйс:</div>
          <b>
            {employeeData?.gender === 'male'
              ? 'Эр'
              : employeeData?.gender === 'female'
                ? 'Эм'
                : 'Бусад'}
          </b>
        </div>
        <div>
          <div className="grid grid-cols-[200px_1fr] text-sm gap-2">
            <div>Хаяг:</div>
            <b>
              {employeeParentAddress?.name}, {employeeSubAddress?.name}, {employeeData?.address}
            </b>

            <div>Утасны дугаар:</div>
            <b>{employeeData?.phoneNumber}</b>

            <div>Мэргэжил:</div>
            <b>{employeeData?.profession}</b>
          </div>
        </div>
      </div>

      <Separator />
      <div>
        <h3 className="text-lg font-medium">Үзлэгийн мэдээлэл</h3>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div>
          <div className="grid grid-cols-[200px_1fr] text-sm gap-2">
            <div>Үзлэгийн огноо</div>
            <b>{employeeData?.date}</b>

            <div>Үзлэгийн төрөл</div>
            <b>{employeeData?.type === 'lower' ? 'Lower Gi' : 'Upper Gi'}</b>

            <div>Эмч</div>
            <b>{doctor?.displayName}</b>

            <div>Сувилагч</div>
            <b>{nurse?.displayName}</b>

            <div>Онош</div>
            <b>{employeeData?.diagnosis}</b>

            <div>Дүгнэлт</div>
            <b>{employeeData?.summary}</b>
          </div>
        </div>

        <div className="text-sm">
          <div className="flex gap-4 items-center justify-between">
            <div>Файлууд</div>
            <Button
              variant="secondary"
              onClick={async () => {
                await window.api.openFolder(employeeData?.folderPath)
              }}
            >
              <span className="me-2">Файлын хавтасруу очих</span> <RxArrowRight />
            </Button>
          </div>
          <div className="flex flex-wrap mt-4 gap-2">
            {employeeData?.images?.map((imageData) => {
              return (
                <div key={imageData.id} className="border">
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center bg-red-500 text-white w-6 text-left">
                      {imageData.orderIndex}
                    </div>
                    {imageData.name}
                  </div>
                  <div className="relative group/item">
                    <img
                      src={imageData?.path}
                      alt={imageData.name}
                      className="max-w-[200px] object-contain"
                    />
                    <div className="group/edit invisible group-hover/item:visible bg-white/20 absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setSelectedImage(imageData)
                          setShowModal(true)
                        }}
                      >
                        <RxEyeOpen />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {showModal && (
        <Dialog
          open={showModal}
          onOpenChange={(e) => {
            if (!e) {
              setShowModal(false)
              setSelectedImage(undefined)
            }
          }}
        >
          <DialogContent className="max-w-[800px] ">
            <DialogHeader>
              <DialogTitle className="flex gap-2">
                <span className="font-bold leading-none text-white text-xs h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  {selectedImage?.orderIndex}
                </span>
                {selectedImage?.name}
              </DialogTitle>
              <DialogDescription></DialogDescription>
              <img
                src={selectedImage?.path}
                alt={selectedImage?.name}
                className="object-contain select-none pointer-events-none"
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default DetailTab
