import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/auth-context'

const ProfileForm = () => {
  const { user, token, getUserData } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset
  } = useForm({
    defaultValues: {
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      position: user.position
    }
  })

  const onSubmit = async (values) => {
    const { displayName, position } = values
    const res = await window.api.updateProfile(
      {
        position,
        displayName
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
    getUserData()
  }

  return (
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
                disabled
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
              <Select id={name} name={name} value={value} onValueChange={onChange} disabled>
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
      {/* <Controller
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
      /> */}

      <div className="col-span-2 flex justify-end">
        <Button type="submit" disabled={!isDirty}>
          Хадгалах
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm
