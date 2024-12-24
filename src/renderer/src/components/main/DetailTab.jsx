import { useCallback, useEffect, useState } from 'react'
import { useNewData } from '../../context/new-data-context'
import { Separator } from '../ui/seperator'
import { useAddress } from '../../context/address-context'
import { useUsers } from '../../context/users-context'
import { Button } from '../ui/Button'
import { RxArrowRight, RxEyeOpen } from 'react-icons/rx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog'
import { toast } from 'sonner'
import { calculateAgeFromRegister } from '../../lib/utils'
import { useOptions } from '../../context/options-context'
import { TbPrinter } from 'react-icons/tb'
import EditDetailForm from './EditDetailForm'

const DetailTab = () => {
  const { tabs, selectedTab } = useNewData()
  const { parentAddress, allAddressData } = useAddress()
  const { users } = useUsers()
  const selectedTabData = tabs[selectedTab]
  const [employeeData, setEmployeeData] = useState()
  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState()
  const [loading, setLoading] = useState(false)
  const { allOptions } = useOptions()
  const [editData, setEditData] = useState(false)

  const inspectionData = allOptions?.filter((item) => item.type === 'inspectionType')
  const scopeData = allOptions?.filter((item) => item.type === 'scopeType')
  const procedureData = allOptions?.filter((item) => item.type === 'procedureType')
  const selectedType = inspectionData.find((item) => item.value === employeeData?.type)
  const selectedScope = scopeData.find((item) => item.value === employeeData?.scopeType)
  const selectedProcedure = procedureData.find((item) => item.value === employeeData?.procedure)

  const getDetailEmployee = useCallback(async (_id) => {
    const res = await window.api.getEmployee(_id)
    setEmployeeData(res)
  }, [])

  useEffect(() => {
    localStorage.removeItem('printData')
    getDetailEmployee(selectedTabData?.id)
  }, [getDetailEmployee, selectedTabData])

  const employeeParentAddress = parentAddress?.find((item) => item.id === employeeData?.cityId)
  const employeeSubAddress = allAddressData?.find((item) => item.id === employeeData?.districtId)

  const doctor = users.find((u) => u.id === employeeData?.doctorId)
  const nurse = users.find((u) => u.id === employeeData?.nurseId)
  const selectedImages = employeeData?.images?.filter((item) => item.type === 'selected') || []

  const handlePrint = async (isPrint) => {
    setLoading(true)
    localStorage.setItem(
      'printData',
      JSON.stringify({
        employeeData,
        employeeParentAddress,
        employeeSubAddress,
        doctor,
        nurse
      })
    )
    const res = await window.api.printPdf({
      uuid: employeeData?.uuid,
      createdDate: employeeData?.createdAt,
      isPrint
    })

    setLoading(false)
    if (!res?.result) {
      toast.error('Амжилтгүй', {
        action: {
          label: 'Хаах',
          onClick: () => {}
        },
        duration: 1000,
        richColors: true,
        description: res?.message || 'Тайлан боловсруулахад алдаа гарлаа'
      })
    }
  }

  const info = calculateAgeFromRegister(employeeData?.regNo)
  return (
    <div>
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

              <div>Дурангийн төрөл</div>
              <b>{selectedScope?.name}</b>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[200px_1fr] text-sm gap-2">
              <div>Заалт</div>
              <b>{employeeData?.diseaseIndication}</b>

              <div>Мэдээ алдууулалт</div>
              <b>{employeeData?.anesthesia}%</b>

              <div>Нэмэлт процедур</div>
              <b>{selectedProcedure?.name}</b>
            </div>
          </div>
        </div>
        <Separator />

        <div className="mt-6 grid grid-cols-2">
          <div>
            <div className="col-span-2">
              <h3 className="text-lg font-medium">Өвчтөний мэдээлэл</h3>
            </div>
            <div className="grid grid-cols-[200px_1fr] text-sm gap-2 mt-6">
              <div>Нэр:</div>
              <b>
                {employeeData?.firstName?.[0]}. {employeeData?.lastName}
              </b>

              <div>Регистрийн дугаар:</div>
              <b>{employeeData?.regNo}</b>

              <div>Төгсөн огноо:</div>
              <b>{info?.birthDate}</b>

              <div>Нас:</div>
              <b>{info?.age}</b>

              <div>Хүйс:</div>
              <b>
                {employeeData?.gender === 'male'
                  ? 'Эр'
                  : employeeData?.gender === 'female'
                    ? 'Эм'
                    : 'Бусад'}
              </b>

              <div>Хаяг:</div>
              <b>
                {employeeParentAddress?.name}, {employeeSubAddress?.name}, {employeeData?.address}
              </b>

              <div>Утасны дугаар:</div>
              <b>{employeeData?.phoneNumber}</b>
            </div>
          </div>
          <div>
            <div className="col-span-2">
              <h3 className="text-lg font-medium">Үзлэгийн мэдээлэл</h3>
            </div>
            <div className="grid grid-cols-[200px_1fr] text-sm gap-2 mt-6">
              <div>Үзлэгийн огноо</div>
              <b>{employeeData?.date}</b>

              <div>Үзлэгийн төрөл</div>
              <b>{selectedType?.name}</b>

              <div>Эмч</div>
              <b>{doctor?.displayName}</b>

              <div>Сувилагч</div>
              <b>{nurse?.displayName}</b>

              <div>Онош</div>
              <b>{employeeData?.diagnosis}</b>
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-sm my-2">Дүгнэлт</div>
            <div
              className="!text-sm"
              dangerouslySetInnerHTML={{
                __html: employeeData?.summary
              }}
            />
          </div>
        </div>

        <Separator />

        {}
        <div className="mt-6 text-sm">
          {editData ? null : (
            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <Button onClick={() => handlePrint(true)} disabled={loading}>
                  <TbPrinter className="me-2" />
                  Тайлан хэвлэх
                </Button>
                <Button variant={'secondary'} onClick={() => handlePrint(false)} disabled={loading}>
                  <RxEyeOpen className="me-2" />
                  Тайлан харах
                </Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await window.api.openFolder(employeeData?.folderPath)
                  }}
                >
                  <span className="me-2">Файлын хавтасруу очих</span> <RxArrowRight />
                </Button>
              </div>
              <Button
                onClick={() => {
                  setEditData(true)
                }}
                disabled={loading}
              >
                Засах
              </Button>
            </div>
          )}

          {editData ? (
            employeeData && (
              <EditDetailForm
                employeeData={employeeData}
                onHide={() => {
                  setEditData(false)
                }}
                onSuccess={() => {
                  getDetailEmployee(selectedTabData?.id)
                }}
              />
            )
          ) : (
            <div className="grid grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 mt-4 gap-2">
              {selectedImages?.map((imageData) => {
                return (
                  <div key={imageData.id} className="border">
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center bg-red-500 text-white w-6 text-left">
                        {imageData.position}
                      </div>
                      <p className="flex-1 truncate whitespace-nowrap">{imageData.name}</p>
                    </div>
                    <div className="relative group/item">
                      <img
                        src={imageData?.path}
                        alt={imageData.name}
                        className="w-full object-contain"
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
          )}
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
            <DialogContent className="max-w-[800px] max-h-[800px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex gap-2">
                  <span className="font-bold leading-none text-white text-xs h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    {selectedImage?.position}
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
    </div>
  )
}

export default DetailTab
