import { Controller, useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { toast } from 'sonner'

const UpdateOptionModal = ({
  open = false,
  onHide = () => {},
  onSuccess = () => {},
  data,
  title = ''
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      name: data?.name
    }
  })

  const onSubmit = async (values) => {
    const res = await window.api.updateOptions({
      ...values,
      id: data.id
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

    toast.success('Амжилттай', {
      action: {
        label: 'Хаах',
        onClick: () => {}
      },
      duration: 3000,
      description: 'Мэдээлэл хадгалагдлаа',
      richColors: true
    })
    reset()
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name={'name'}
            key={'name'}
            rules={{
              required: 'Нэр оруулна уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex flex-col items-start gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Нэр
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

          <div className="col-span-2 flex justify-end mt-12">
            <Button type="submit" disabled={!isDirty}>
              Хадгалах
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateOptionModal
