import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog'
import { Controller, useForm } from 'react-hook-form'
import { Label } from '../ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'
import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { toast } from 'sonner'

const AddressRegisterModal = ({
  open = false,
  onHide = () => {},
  onSuccess = () => {},
  parentAddress = []
}) => {
  const [type, setType] = useState('city')
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      cityName: '',
      districtName: '',
      parentId: ''
    }
  })

  const onSubmit = async (values) => {
    const res = await window.api.saveAddress({
      ...values,
      type
    })

    if (!res?.result) {
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

    onSuccess()
    reset()
    toast.success('Амжилттай', {
      action: {
        label: 'Хаах',
        onClick: () => {}
      },
      duration: 3000,
      description: 'Мэдээлэл хадгалагдлаа',
      richColors: true
    })
    onHide()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          reset()
          onHide()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Хаяг бүртгэх</DialogTitle>
          <DialogDescription>
            Та эхний сонголтоос хот/аймаг эсвэл дүүрэг/сум-ын алийг бүртгэхээ сонгоно уу
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-2 mt-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-start gap-1">
            <Label htmlFor="type" className="pb-1">
              Ангилал
            </Label>
            <Select
              id="type"
              name="type"
              value={type}
              onValueChange={(e) => {
                reset()
                setType(e)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Үүрэг" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city">Хот/аймаг</SelectItem>
                <SelectItem value="district">Дүүрэг/сум</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'city' ? (
            <Controller
              control={control}
              name={'cityName'}
              key={'cityName'}
              rules={{
                required: 'Хот/аймаг нэр оруулна уу'
              }}
              render={({ field: { value, onChange, name }, fieldState: { error } }) => {
                return (
                  <div className="flex flex-col items-start gap-1">
                    <Label htmlFor={name} className="pb-1">
                      Хот/аймаг нэр
                    </Label>
                    <Input
                      id={name}
                      name={name}
                      value={value}
                      placeholder="Хот/аймаг нэр"
                      onChange={(e) => {
                        onChange(e.target.value)
                      }}
                    />
                    {error && <p className="text-sm text-destructive">{error.message}</p>}
                  </div>
                )
              }}
            />
          ) : (
            <>
              <Controller
                control={control}
                name={'parentId'}
                key={'parentId'}
                rules={{
                  required: 'Хот/аймаг сонгоно уу'
                }}
                render={({ field: { value, onChange, name }, fieldState: { error } }) => {
                  return (
                    <div className="flex flex-col items-start gap-1">
                      <Label htmlFor={name} className="pb-1">
                        Хот/аймаг
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
                          <SelectValue placeholder="Хот/аймаг" />
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
                name={'districtName'}
                key={'districtName'}
                rules={{
                  required: 'Дүүрэг/сум нэр оруулна уу'
                }}
                render={({ field: { value, onChange, name }, fieldState: { error } }) => {
                  return (
                    <div className="flex flex-col items-start gap-1">
                      <Label htmlFor={name} className="pb-1">
                        Дүүрэг/сум нэр
                      </Label>
                      <Input
                        id={name}
                        name={name}
                        value={value}
                        placeholder="Дүүрэг/сум нэр"
                        onChange={(e) => {
                          onChange(e.target.value)
                        }}
                      />
                      {error && <p className="text-sm text-destructive">{error.message}</p>}
                    </div>
                  )
                }}
              />
            </>
          )}
          <div className="col-span-2 flex justify-end mt-12">
            <Button type="submit">Хадгалах</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddressRegisterModal
