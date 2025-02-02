import { Controller, useForm } from 'react-hook-form'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { toast } from 'sonner'
import { useState } from 'react'
import { useHospital } from '../../context/hospital-context'

const HospitalCreateForm = ({ onSuccess = () => {} }) => {
  const [loading, setLoading] = useState(false)
  const { getHospitalData } = useHospital()
  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
      departmentName: '',
      phoneNumber: '',
      address: ''
    }
  })

  const onSubmit = async (values) => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const res = await window.api.createHospitalData(values, token)

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
      setLoading(false)
      return
    }
    getHospitalData()
    onSuccess()
    setLoading(false)
  }

  return (
    <div className="w-full mt-12">
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-span-2">
          <Controller
            control={control}
            name={'name'}
            key={'name'}
            rules={{
              required: 'Эмнэлгийн нэр оруулна уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex flex-col gap-1 items-start">
                  <Label htmlFor={name} className="pb-1">
                    Эмнэлгийн нэр
                  </Label>
                  <Input
                    id={name}
                    name={name}
                    value={value}
                    placeholder="Эмнэлгийн нэр"
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
        <Controller
          control={control}
          name={'departmentName'}
          key={'departmentName'}
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
        <div className="col-span-2">
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
                    rows={2}
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
        </div>

        <div className="col-span-2 w-full flex justify-end mt-12">
          <Button type="submit" disabled={loading}>
            Хадгалах
          </Button>
        </div>
      </form>
    </div>
  )
}

export default HospitalCreateForm
