import { Input } from '../../ui/Input'
import { Label } from '../../ui/Label'
import { Separator } from '../../ui/seperator'
import { Textarea } from '../../ui/Textarea'
import { Controller } from 'react-hook-form'
import { DatePicker } from '../../ui/date-picker'
import { Button } from '../../ui/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select'
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'
import { TreeDatePicker } from '../../ui/tree-date-picker'
import { useAddress } from '../../../context/address-context'
import { useEffect, useMemo, useState } from 'react'
import { useNewData } from '../../../context/new-data-context'
import { useUsers } from '../../../context/users-context'
import { useHospital } from '../../../context/hospital-context'
import { BsCameraReelsFill } from 'react-icons/bs'
import { useAuth } from '../../../context/auth-context'
import { toast } from 'sonner'

const GeneralInformation = ({ nextStep = () => {} }) => {
  const { hospitalData } = useHospital()
  const { token } = useAuth()
  const { users, getEmployeeList } = useUsers()
  const [error, setError] = useState('')
  const { parentAddress, allAddressData } = useAddress()
  const { generalInformationForm, newData, complete, selectedTab } = useNewData()

  const { control, handleSubmit, watch } = generalInformationForm

  const watchFields = watch()
  const cityId = watchFields.cityId

  const doctors = users.filter((u) => u.role === 'doctor')
  const nurses = users.filter((u) => u.role === 'nurse')

  const subAddress = useMemo(() => {
    return allAddressData.filter((item) => item.parentId === cityId)
  }, [allAddressData, cityId])

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
    if (
      !newData?.tempVideoPath ||
      (newData?.tempImages && newData.tempImages?.some((item) => !item?.path))
    ) {
      setError('Бичлэг, зураг бүрэн хийгдээгүй байна.')
      return
    }
    const { sourceType, tempVideoPath, tempImages } = newData
    const res = await window.api.createEmployee({
      data: {
        ...values,
        videoPath: tempVideoPath,
        sourceType
      },
      images: tempImages,
      token
    })

    if (res.result) {
      await complete(selectedTab)
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
    <form className="space-y-6 px-2" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="text-lg font-medium">Ерөнхий мэдээлэл</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Controller
          control={control}
          name={'hospitalName'}
          key={'hospitalName'}
          render={({ field: { name, onChange, value } }) => {
            return (
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor={name} className="pb-1">
                  Эмнэлгийн нэр <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  readonly
                />
              </div>
            )
          }}
        />
        <Controller
          control={control}
          name={'departmentName'}
          key={'departmentName'}
          defaultValue={hospitalData.departmentName}
          render={({ field: { name, value, onChange } }) => {
            return (
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor={name} className="pb-1">
                  Тасгийн нэр <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  readonly
                />
              </div>
            )
          }}
        />

        <Controller
          control={control}
          name={'date'}
          key={'date'}
          rules={{
            required: 'Үзлэгийн огноо оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col items-start gap-1">
                <Label htmlFor={name} className="pb-1">
                  Үзлэгийн огноо <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  id={name}
                  value={value}
                  className="w-full"
                  placeholder="Үзлэгийн огноо сонгох"
                  hideIcon
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Controller
          control={control}
          name={'patientCondition'}
          key={'patientCondition'}
          rules={{
            required: 'Өвчтөний байдал оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Өвчтөний байдал <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Өвчтөний байдал"
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
                <Select
                  id={name}
                  name={name}
                  value={value}
                  onValueChange={(e) => onChange(Number(e))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Мэдээ алдуулалт сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={1}>Dicaini 1%-0.5</SelectItem>
                  </SelectContent>
                </Select>
                {error && <p className="text-sm text-destructive">{error.message}</p>}
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
        />
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
        <Controller
          control={control}
          name={'regNo'}
          key={'regNo'}
          render={({ field: { value, onChange, name } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Регистрийн дугаар
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
              </div>
            )
          }}
        />
        <Controller
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
        />

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
          name={'profession'}
          key={'profession'}
          render={({ field: { value, onChange, name } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Мэргэжил
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  placeholder="Мэргэжил"
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
                  <SelectContent>
                    <SelectItem value="upper">Upper Gi</SelectItem>
                    <SelectItem value="lower">Lower Gi</SelectItem>
                  </SelectContent>
                </Select>
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Controller
          control={control}
          name={'diagnosis'}
          key={'diagnosis'}
          rules={{
            required: 'Онош оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Онош <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={name}
                  name={name}
                  value={value}
                  rows={3}
                  placeholder="Онош"
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
          name={'summary'}
          key={'summary'}
          rules={{
            required: 'Дүгнэлт оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Дүгнэлт <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={name}
                  name={name}
                  value={value}
                  rows={3}
                  placeholder="Дүгнэлт"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
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
          rules={{
            required: 'Сувилагч сонгоно уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Сувилагч <span className="text-red-500">*</span>
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
      <div>
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
        </div>
        <div className="text-sm text-destructive mt-0.5">{error}</div>
      </div>
    </form>
  )
}

export default GeneralInformation
