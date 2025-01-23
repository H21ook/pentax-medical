import { Input } from '../../ui/Input'
import { Label } from '../../ui/Label'
import { Separator } from '../../ui/seperator'
import { Controller } from 'react-hook-form'
import { DatePicker } from '../../ui/date-picker'
import { Button } from '../../ui/Button'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../../ui/Select'
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'
import { useAddress } from '../../../context/address-context'
import { useEffect, useMemo, useState } from 'react'
import { useNewData } from '../../../context/new-data-context'
import { useUsers } from '../../../context/users-context'
import { useHospital } from '../../../context/hospital-context'
import { BsCameraReelsFill } from 'react-icons/bs'
import { useAuth } from '../../../context/auth-context'
import { toast } from 'sonner'
import Editor from '../../ui/Editor'
import { useOptions } from '../../../context/options-context'
import { format } from 'date-fns'

const GeneralInformation = ({ nextStep = () => {} }) => {
  const REGISTRY_REG = /^[\p{а-яА-ЯёүөЁҮӨ}]{2}[0-9]{8}$/
  const { hospitalData } = useHospital()
  const { token } = useAuth()
  const { users, getEmployeeList } = useUsers()
  const [error, setError] = useState('')
  const { parentAddress, allAddressData } = useAddress()
  const { generalInformationForm, newData, complete, selectedTab } = useNewData()
  const { allOptions } = useOptions()

  const { control, handleSubmit, watch } = generalInformationForm

  const watchFields = watch()
  const cityId = watchFields.cityId

  const doctors = users.filter((u) => u.role === 'doctor')
  const nurses = users.filter((u) => u.role === 'nurse')

  const subAddress = useMemo(() => {
    return allAddressData.filter((item) => item.parentId === cityId)
  }, [allAddressData, cityId])

  const inspectionData = allOptions?.filter((item) => item.type === 'inspectionType')
  const scopeData = allOptions?.filter((item) => item.type === 'scopeType')
  const procedureData = allOptions?.filter((item) => item.type === 'procedureType')
  const anesthesiaData = allOptions?.filter((item) => item.type === 'anesthesia')
  const diagnosisData = allOptions?.filter((item) => item.type === 'diagnosis')

  useEffect(() => {
    localStorage.setItem(
      'newData',
      JSON.stringify({
        ...newData,
        ...watchFields
      })
    )
  }, [watchFields])

  const onSubmit = async (values) => {
    if (!newData?.tempVideoPath || newData?.tempImages?.some((item) => !item?.path)) {
      setError('Бичлэг, зураг бүрэн хийгдээгүй байна.')
      return
    }

    const { sourceType, tempVideoPath, tempImages, images, uuid } = newData
    const res = await window.api.createEmployee({
      data: {
        ...values,
        uuid,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        hospitalName: hospitalData?.name,
        departmentName: hospitalData?.departmentName,
        videoPath: tempVideoPath,
        sourceType
      },
      images,
      tempImages,
      token
    })

    if (res.result) {
      await complete(selectedTab, res?.result)
      await getEmployeeList()
      toast.success('Амжилттай', {
        action: {
          label: 'Хаах',
          onClick: () => {}
        },
        duration: 3000,
        richColors: true,
        description: 'Үзлэг амжилттай бүртгэгдлээ'
      })
      return
    }

    toast.error('Амжилтгүй', {
      action: {
        label: 'Хаах',
        onClick: () => {}
      },
      duration: 3000,
      richColors: true,
      description: res?.message || 'Алдаа гарлаа'
    })
  }

  return (
    <form className="space-y-6 px-2 pb-[50px]" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-medium">Ерөнхий мэдээлэл</h3>{' '}
        <p className="select-text">({newData?.uuid})</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Controller
          control={control}
          name={'hospitalName'}
          key={'hospitalName'}
          render={({ field: { name } }) => {
            return (
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor={name} className="pb-1">
                  Эмнэлгийн нэр <span className="text-red-500">*</span>
                </Label>
                <Input id={name} name={name} readonly value={hospitalData.name} />
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'departmentName'}
          key={'departmentName'}
          render={({ field: { name } }) => {
            return (
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor={name} className="pb-1">
                  Тасгийн нэр <span className="text-red-500">*</span>
                </Label>
                <Input id={name} name={name} readonly value={hospitalData.departmentName} />
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'scopeType'}
          key={'scopeType'}
          render={({ field: { value, onChange, name } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Дурангийн төрөл <span className="text-red-500">*</span>
                </Label>
                <Select id={name} name={name} value={value} onValueChange={(e) => onChange(e)}>
                  <SelectTrigger readonly={true}>
                    <SelectValue placeholder="Дурангийн төрөл" />
                  </SelectTrigger>
                  <SelectContent
                    data={scopeData?.map((item) => ({
                      value: item?.value,
                      label: item?.name
                    }))}
                  />
                </Select>
              </div>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Controller
          control={control}
          name={'diseaseIndication'}
          key={'diseaseIndication'}
          rules={{
            required: 'Заалт оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Заалт <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Заалт"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'anesthesia'}
          key={'anesthesia'}
          rules={{
            required: 'Мэдээ алдуулалт сонгоно уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Мэдээ алдуулалт <span className="text-red-500">*</span>
                </Label>
                <Select id={name} name={name} value={value} onValueChange={(e) => onChange(e)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Мэдээ алдуулалт сонгох" />
                  </SelectTrigger>
                  <SelectContent
                    data={anesthesiaData?.map((item) => ({
                      value: item?.value,
                      label: item?.name
                    }))}
                  />
                </Select>
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'procedure'}
          key={'procedure'}
          render={({ field: { value, onChange, name } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Нэмэлт процедур <span className="text-red-500">*</span>
                </Label>
                <Select id={name} name={name} value={value} onValueChange={(e) => onChange(e)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Нэмэлт процедур сонгох" />
                  </SelectTrigger>
                  <SelectContent
                    data={procedureData?.map((item) => ({
                      value: item?.value,
                      label: item?.name
                    }))}
                  />
                </Select>
              </div>
            )
          }}
        />
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium">Өвчтөний мэдээлэл</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Controller
          control={control}
          name={'firstName'}
          key={'firstName'}
          rules={{
            required: 'Овог оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Овог <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Овог"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'lastName'}
          key={'lastName'}
          rules={{
            required: 'Нэр оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Нэр <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Нэр"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'regNo'}
          key={'regNo'}
          rules={{
            required: 'Регистрийн дугаар оруулна уу',
            pattern: {
              value: REGISTRY_REG,
              message: 'Регистрийн дугаар буруу байна'
            }
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Регистрийн дугаар <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Регистрийн дугаар"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        {/* <Controller
          control={control}
          name={'birthDate'}
          key={'birthDate'}
          rules={{
            required: 'Төрсөн огноо оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor={name} className="pb-1">
                  Төрсөн огноо <span className="text-red-500">*</span>
                </Label>
                <TreeDatePicker
                  id={name}
                  value={value}
                  className="w-full"
                  defaultYear={1987}
                  placeholder="Төрсөн огноо сонгох"
                  hideIcon
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        /> */}
        <Controller
          control={control}
          name={'gender'}
          key={'gender'}
          render={({ field: { value, onChange, name } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Хүйс <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={value}
                  onValueChange={onChange}
                  className="flex items-center h-9"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="px-2">
                      Эр
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="px-2">
                      Эм
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="px-2">
                      Бусад
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )
          }}
        />

        {/* <Controller
          control={control}
          name={'age'}
          key={'age'}
          render={({ field: { value, onChange, name } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Нас
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Нас"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
              </div>
            )
          }}
        /> */}

        <Controller
          control={control}
          name={'phoneNumber'}
          key={'phoneNumber'}
          render={({ field: { value, onChange, name } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Утасны дугаар
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Утасны дугаар"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'cityId'}
          key={'cityId'}
          rules={{
            required: 'Хот/Аймаг сонгоно уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Хот/Аймаг <span className="text-red-500">*</span>
                </Label>
                <Select
                  id={name}
                  name={name}
                  value={value}
                  onValueChange={(e) => {
                    onChange(Number(e))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Хот/Аймаг сонгох" />
                  </SelectTrigger>
                  <SelectContent
                    data={parentAddress?.map((item) => ({
                      value: item?.id,
                      label: item?.name
                    }))}
                  />
                </Select>
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'districtId'}
          key={'districtId'}
          rules={{
            required: 'Дүүрэг/Сум сонгоно уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Дүүрэг/Сум <span className="text-red-500">*</span>
                </Label>
                <Select
                  id={name}
                  name={name}
                  value={value}
                  onValueChange={(e) => onChange(Number(e))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Дүүрэг/Сум сонгох" />
                  </SelectTrigger>
                  <SelectContent
                    data={subAddress?.map((item) => ({
                      value: item?.id,
                      label: item?.name
                    }))}
                  />
                </Select>
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />

        <Controller
          control={control}
          name={'address'}
          key={'address'}
          render={({ field: { value, onChange, name } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Хаяг
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Хаяг"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
              </div>
            )
          }}
        />
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium">Үзлэгийн мэдээлэл</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Controller
          control={control}
          name={'type'}
          key={'type'}
          rules={{
            required: 'Үзлэгийн төрөл сонгоно уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Үзлэгийн төрөл <span className="text-red-500">*</span>
                </Label>
                <Select
                  id={name}
                  name={name}
                  value={value}
                  onValueChange={(e) => {
                    onChange(e)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Үзлэгийн төрөл сонгох" />
                  </SelectTrigger>
                  <SelectContent
                    data={inspectionData?.map((item) => ({
                      value: item?.value,
                      label: item?.name
                    }))}
                  />
                </Select>
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'date'}
          key={'date'}
          render={({ field: { name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor={name} className="pb-1">
                  Үзлэгийн огноо <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  id={name}
                  value={format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                  disabled={true}
                  format="yyyy-MM-dd HH:mm:ss"
                  className="w-full"
                  placeholder="Үзлэгийн огноо сонгох"
                  hideIcon
                />
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'diagnosis'}
          key={'diagnosis'}
          rules={{
            required: 'Онош сонгоно уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Онош <span className="text-red-500">*</span>
                </Label>
                <Select id={name} name={name} value={value} onValueChange={(e) => onChange(e)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Онош сонгох" />
                  </SelectTrigger>
                  <SelectContent
                    data={diagnosisData?.map((item) => ({
                      value: item?.value,
                      label: item?.name
                    }))}
                  />
                </Select>
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Controller
          control={control}
          name={'summary'}
          key={'summary'}
          rules={{
            required: 'Дүгнэлт оруулна уу'
          }}
          render={({ field, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Дүгнэлт <span className="text-red-500">*</span>
                </Label>

                <Editor
                  id={field.name}
                  placeholder="Дүгнэлт"
                  value={field.value}
                  onChange={field.onChange}
                />
                {/* <Textarea
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Дүгнэлт"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                  rows={3}
                /> */}
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Controller
          control={control}
          name={'doctorId'}
          key={'doctorId'}
          rules={{
            required: 'Эмч сонгоно уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Эмч <span className="text-red-500">*</span>
                </Label>
                <Select
                  id={name}
                  name={name}
                  value={value}
                  onValueChange={(e) => onChange(Number(e))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Эмч сонгох" />
                  </SelectTrigger>
                  <SelectContent
                    data={doctors?.map((item) => ({
                      value: item?.id,
                      label: item?.displayName
                    }))}
                  />
                </Select>
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'nurseId'}
          key={'nurseId'}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Сувилагч
                </Label>
                <Select
                  id={name}
                  name={name}
                  value={value}
                  onValueChange={(e) => onChange(Number(e))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Сувилагч сонгох" />
                  </SelectTrigger>
                  <SelectContent
                    data={nurses?.map((item) => ({
                      value: item?.id,
                      label: item?.displayName
                    }))}
                  />
                </Select>
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
      </div>
      <div className="fixed left-0 bottom-[53px] bg-background w-full py-2 px-4 border-t">
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            className={error ? 'border-destructive' : ''}
            onClick={() => {
              setError('')
              nextStep()
            }}
          >
            <BsCameraReelsFill className="text-[20px] me-2" />
            Бичлэг хийх
          </Button>
          <Button type="submit">Үзлэг дуусгах</Button>

          <div className="text-sm text-destructive mt-0.5">{error}</div>
        </div>
      </div>
    </form>
  )
}

export default GeneralInformation
