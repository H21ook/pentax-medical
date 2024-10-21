import { Controller, useForm } from 'react-hook-form'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'

const HospitalForm = () => {
  const { control } = useForm({
    defaultValues: {
      hospitalName: '',
      tasagName: '',
      phoneNumber: '',
      address: ''
    }
  })

  return (
    <div className="mt-4">
      <h1 className="text-lg font-semibold my-4">Эмнэлэгийн тохиргоо</h1>
      <form className="grid grid-cols-2 gap-4 max-w-[867px]">
        <Controller
          control={control}
          name={'hospitalName'}
          key={'hospitalName'}
          rules={{
            required: 'Эмнэлэгийн нэр оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1 ">
                <Label htmlFor={name} className="pb-1">
                  Эмнэлэгийн нэр
                </Label>
                <Input
                  id={name}
                  name={name}
                  value={value}
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
              <div className="flex flex-col gap-1">
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
              <div className="flex flex-col gap-1">
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
        <Controller
          control={control}
          name={'address'}
          key={'address'}
          rules={{
            required: 'Хаяг оруулна уу'
          }}
          render={({ field: { value, onChange, name }, fieldState: { error } }) => {
            return (
              <div className="flex flex-col gap-1">
                <Label htmlFor={name} className="pb-1">
                  Хаяг
                </Label>
                <Textarea
                  id={name}
                  name={name}
                  value={value}
                  rows={3}
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
        <div className="col-span-2 w-full flex justify-end">
          <Button>Хадгалах</Button>
        </div>
      </form>
    </div>
  )
}

export default HospitalForm
