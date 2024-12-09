import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx'
import { useAuth } from '../../context/auth-context'

const WorkerChangePasswordModal = ({
  open = false,
  onHide = () => {},
  onSuccess = () => {},
  data
}) => {
  const [showPass, setShowPass] = useState(false)
  const { token } = useAuth()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      password: ''
    }
  })

  const onSubmit = async (values) => {
    const res = await window.api.changeUserPassword(
      {
        userId: data.id,
        password: values.password
      },
      token
    )
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
    toast.success('Амжилттай', {
      action: {
        label: 'Хаах',
        onClick: () => {}
      },
      duration: 3000,
      richColors: true,
      description: 'Хэрэглэгчийн нууц үг амжилттай солигдлоо.'
    })
    onSuccess()
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
          <DialogTitle>Нууц үг солих</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4 mt-2 mb-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name={'password'}
            key={'password'}
            rules={{
              required: 'Нууц үг оруулна уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex-1 flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Нууц үг
                  </Label>
                  <div className="flex gap-1">
                    <Input
                      id={name}
                      name={name}
                      value={value}
                      type={showPass ? 'text' : 'password'}
                      onChange={(e) => {
                        onChange(e.target.value)
                      }}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setShowPass((prev) => !prev)
                      }}
                    >
                      {showPass ? <RxEyeClosed /> : <RxEyeOpen />}
                    </Button>
                  </div>
                  {error && <p className="text-sm text-destructive">{error.message}</p>}
                </div>
              )
            }}
          />

          <div className="col-span-2 flex justify-end">
            <Button type="submit">Хадгалах</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default WorkerChangePasswordModal
