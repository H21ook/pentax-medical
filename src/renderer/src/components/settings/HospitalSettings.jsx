import { Controller, useForm } from 'react-hook-form'
import { Button } from '../ui/Button'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'
import { Input } from '../ui/Input'
import { useHospital } from '../../context/hospital-context'
import { toast } from 'sonner'
import { useAuth } from '../../context/auth-context'

const HospitalSettings = () => {
  const { token, user } = useAuth()
  const { hospitalData } = useHospital()

  const isRead = user.role === 'worker'

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      name: hospitalData.name,
      tasagName: hospitalData.tasagName,
      phoneNumber: hospitalData.phoneNumber,
      address: hospitalData.address
    }
  })

  const onSubmit = async (values) => {
    const res = await window.api.updateHospitalData(values, token)

    if (!res.result) {
      toast.error('Амжилтгүй', {
        action: {
          label: 'Хаах',
          onClick: () => {}
        },
        duration: 3000,
        richColors: true,
        description: res.message
      })
      return
    }
    reset(values)
    toast.success('Амжилттай', {
      action: {
        label: 'Хаах',
        onClick: () => {}
      },
      duration: 3000,
      description: 'Мэдээлэл хадгалагдлаа',
      richColors: true
    })
  }

  return (
    <div className="w-full">
      <h1 className="font-semibold mb-4 mt-2">Эмнэлэгийн тохиргоо</h1>
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name={'name'}
          key={'name'}
          rules={{
            required: 'Эмнэлэгийн нэр оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Эмнэлэгийн нэр
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  readonly={isRead}
                  placeholder="Эмнэлэгийн нэр"
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
          name={'tasagName'}
          key={'tasagName'}
          rules={{
            required: 'Тасгийн нэр оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Тасгийн нэр
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  readonly={isRead}
                  placeholder="Тасгийн нэр"
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
          name={'phoneNumber'}
          key={'phoneNumber'}
          rules={{
            required: 'Утасны дугаар оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Утасны дугаар
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
                  readonly={isRead}
                  placeholder="Утасны дугаар"
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
          name={'address'}
          key={'address'}
          rules={{
            required: 'Хаяг оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 items-start">
                <Label htmlFor={name} className="pb-1">
                  Хаяг
                </Label>
                <Textarea
                  id={name}
                  name={name}
                  value={value}
                  rows={3}
                  readonly={isRead}
                  placeholder="Хаяг"
                  className="resize-none"
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
                {error && <p className="text-sm text-destructive">{error.message}</p>}
              </div>
            )
          }}
        />
        {isRead ? null : (
          <div className="col-span-2 w-full flex justify-end">
            <Button type="submit" disabled={!isDirty}>
              Хадгалах
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

export default HospitalSettings
