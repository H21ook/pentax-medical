import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Controller, useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/Select'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx'
import { useState } from 'react'
import { toast } from 'sonner'
import { useUsers } from '../../context/users-context'

const AdminCreateForm = ({ onSuccess = () => {} }) => {
  const [showPass, setShowPass] = useState(false)
  const { getUsers } = useUsers()
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      username: '',
      displayName: '',
      systemRole: 'admin',
      role: 'doctor',
      position: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async ({ username, password, systemRole, role, displayName, position }) => {
    const res = await window.api.registerAndLogin({
      username,
      password,
      position,
      systemRole,
      role,
      displayName,
      isRoot: true
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
    getUsers()
    localStorage.setItem('token', res.data?.token)
    onSuccess()
  }

  const password = watch('password')

  return (
    <form className="grid grid-cols-2 gap-2 mt-12 w-full" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name={'username'}
        key={'username'}
        rules={{
          required: 'Нэвтрэх нэр оруулна уу'
        }}
        render={({ field: { value, onChange, name }, fieldState: { error } }) => {
          return (
            <div className="flex flex-col items-start gap-1">
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
        name={'systemRole'}
        key={'systemRole'}
        rules={{
          required: 'Систем үүрэг сонгоно уу'
        }}
        render={({ field: { value, onChange, name }, fieldState: { error } }) => {
          return (
            <div className="flex flex-col items-start gap-1">
              <Label htmlFor={name} className="pb-1">
                Систем үүрэг
              </Label>
              <Select id={name} name={name} value={value} onValueChange={onChange} disabled>
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
            <div className="flex flex-col items-start gap-1">
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
            <div className="flex flex-col items-start gap-1">
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
            <div className="flex flex-col items-start gap-1">
              <Label htmlFor={name} className="pb-1">
                Үүрэг
              </Label>
              <Select id={name} name={name} value={value} onValueChange={onChange} disabled>
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
      <Controller
        control={control}
        name={'password'}
        key={'password'}
        rules={{
          required: 'Нууц үг оруулна уу'
        }}
        render={({ field: { value, onChange, name }, fieldState: { error } }) => {
          return (
            <div className="flex flex-col items-start gap-1">
              <Label htmlFor={name} className="pb-1">
                Нууц үг
              </Label>
              <div className="flex gap-1 w-full">
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
        name={'confirmPassword'}
        key={'confirmPassword'}
        rules={{
          required: 'Нууц үг давтаж оруулна уу',
          validate: (val) => {
            if (password !== val) {
              return 'Нууц үгтэй тохирохгүй байна'
            }
          }
        }}
        render={({ field: { value, onChange, name }, fieldState: { error } }) => {
          return (
            <div className="flex flex-col items-start gap-1">
              <Label htmlFor={name} className="pb-1">
                Нууц үг давтах
              </Label>
              <div className="flex gap-1 w-full">
                <Input
                  id={name}
                  name={name}
                  value={value}
                  type={showConfirmPass ? 'text' : 'password'}
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                />
                <Button
                  size="icon"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setShowConfirmPass((prev) => !prev)
                  }}
                >
                  {showConfirmPass ? <RxEyeClosed /> : <RxEyeOpen />}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive mt-[-4px]">{error.message}</p>}
            </div>
          )
        }}
      />
      <div className="col-span-2 flex justify-end mt-12">
        <Button type="submit">Үүсгэх</Button>
      </div>
    </form>
  )
}

export default AdminCreateForm
