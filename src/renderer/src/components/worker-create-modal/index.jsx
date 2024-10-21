import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'
import { Button } from '../ui/Button'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx'

const WorkerCreateModal = ({ open = false, onHide = () => {}, onSuccess = () => {} }) => {
  const [showPass, setShowPass] = useState(false)

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: '',
      displayName: '',
      role: 'worker',
      position: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async ({ username, password, role, displayName, position }) => {
    const res = await window.api.registerUser({
      username,
      password,
      position,
      role,
      displayName,
      isRoot: false
    })

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

    reset()
    onSuccess()
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
          <DialogTitle>Ажилтан бүртгэх</DialogTitle>
          <DialogDescription>
            Ажилтан бүртгэх үйлдэл нь энэхүү програмд нэвтрэх эрх үүсгэх ба үүссэн эрхээр нэвтэрч
            орсноор оноогдсон үүргийн дагуу үйлүүдийг гүйцэтгэх юм
          </DialogDescription>
        </DialogHeader>
        <form className="grid grid-cols-2 gap-2 mt-2" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name={'username'}
            key={'username'}
            rules={{
              required: 'Нэвтрэх нэр оруулна уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Нэвтрэх нэр
                  </Label>
                  <Input
                    id={name}
                    name={name}
                    value={value}
                    placeholder="Нэвтрэх нэр"
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
            name={'role'}
            key={'role'}
            rules={{
              required: 'Үүрэг сонгоно уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex-1 flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Үүрэг
                  </Label>
                  <Select id={name} name={name} value={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Үүрэг" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Админ</SelectItem>
                      <SelectItem value="worker">Ажилтан</SelectItem>
                    </SelectContent>
                  </Select>
                  {error && <p className="text-sm text-destructive">{error.message}</p>}
                </div>
              )
            }}
          />
          <Controller
            control={control}
            name={'displayName'}
            key={'displayName'}
            rules={{
              required: 'Нэрээ оруулна уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex-1 flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Нэр
                  </Label>
                  <Input
                    id={name}
                    name={name}
                    value={value}
                    placeholder="Жишээ: А.Бат"
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
            name={'position'}
            key={'position'}
            rules={{
              required: 'Албан тушаал оруулна уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex-1 flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Албан тушаал
                  </Label>
                  <Input
                    id={name}
                    name={name}
                    value={value}
                    placeholder="Жишээ: Их эмч"
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
            <Button type="submit">Бүртгэх</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default WorkerCreateModal
