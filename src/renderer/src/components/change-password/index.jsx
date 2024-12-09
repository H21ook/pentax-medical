import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx'
import { useAuth } from '../../context/auth-context'

const ChangePasswordModal = ({ open = false, onHide = () => {} }) => {
  const [showPass, setShowPass] = useState(false)
  const { token } = useAuth()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: ''
    }
  })

  const onSubmit = async (values) => {
    const res = await window.api.changePassword(values, token)
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
      description: 'Таны нууц үг амжилттай солигдлоо.'
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
          <DialogTitle>Нууц үг солих</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name={'currentPassword'}
            key={'currentPassword'}
            rules={{
              required: 'Нууц үг оруулна уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex-1 flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Одоогийн нууц үг
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

          <Controller
            control={control}
            name={'newPassword'}
            key={'newPassword'}
            rules={{
              required: 'Нууц үг оруулна уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex-1 flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Шинэ нууц үг
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

export default ChangePasswordModal
