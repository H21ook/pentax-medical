import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/auth-context'

const WorkerEditModal = ({ open = false, onHide = () => {}, onSuccess = () => {}, data }) => {
  const { token } = useAuth()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: data?.username,
      displayName: data?.displayName,
      systemRole: data?.systemRole,
      role: data?.role,
      position: data?.position
    }
  })

  // eslint-disable-next-line no-unused-vars
  const onSubmit = async ({ username, ...other }) => {
    const res = await window.api.updateUser(
      {
        ...other,
        id: data?.id
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
      description: 'Хэрэглэгчийн мэдээлэл амжилттай солигдлоо.'
    })
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
          <DialogTitle>Мэдээлэл засах</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="grid grid-cols-2 gap-2 gap-y-4 mt-2" onSubmit={handleSubmit(onSubmit)}>
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
                    readonly={true}
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
            name={'systemRole'}
            key={'systemRole'}
            rules={{
              required: 'Систем үүрэг сонгоно уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex-1 flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Систем үүрэг
                  </Label>
                  <Select id={name} name={name} value={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Систем үүрэг" />
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
                      <SelectItem value="doctor">Эмч</SelectItem>
                      <SelectItem value="nurse">Сувилагч</SelectItem>
                    </SelectContent>
                  </Select>
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

export default WorkerEditModal
