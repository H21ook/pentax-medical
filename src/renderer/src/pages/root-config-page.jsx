import AdminLayout from '../components/layouts/admin-layout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Controller, useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/Select'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx'
import { useState } from 'react'
import dashboardImage from '../assets/dashboard.svg'
import { useRouter } from '../context/page-router'
import { useAuth } from '../context/auth-context'

const RootConfigPage = () => {
  const [showPass, setShowPass] = useState(false)
  const [mainError, setMainError] = useState()
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const router = useRouter()
  const { checkLogged } = useAuth()
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      username: '',
      displayName: '',
      role: 'admin',
      position: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async ({ username, password, role, displayName, position }) => {
    const res = await window.api.registerAndLogin({
      username,
      password,
      position,
      role,
      displayName,
      isRoot: true
    })

    if (!res.result) {
      setMainError(res.message)
      return
    }
    localStorage.setItem('token', res.data?.token)
    checkLogged()
    router.push('main')
  }

  const password = watch('password')

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-48px)] max-w-[1200px] mx-auto p-8 flex items-center justify-center gap-8">
        <div className="max-w-[600px] min-w-300px] flex items-center justify-center">
          <img src={dashboardImage} alt="dashboard" className="w-full" />
        </div>
        <div className="px-8 max-w-[600px] mx-auto">
          <p className="font-bold text-xl mb-2">Програмын админ эрх үүсгэнэ үү</p>
          <p className="text-dimmed">
            Админ эрх нь програмын үндсэн тохиргоог тохируулж, засаж, өөрчлөхөөс гадна ажилтан
            нэмэх, хасах, ажилтны нууц үг сэргээх гэх мэт үйлдлүүдийг хийх боломжтой.
          </p>
          <form className="grid grid-cols-2 gap-2 mt-8" onSubmit={handleSubmit(onSubmit)}>
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
                  <div className="flex-1 flex flex-col gap-1">
                    <Label htmlFor={name} className="pb-1">
                      Нууц үг давтах
                    </Label>
                    <div className="flex gap-1">
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
            <div className="col-span-2 flex justify-end">
              <Button type="submit">Үүсгэх</Button>
            </div>

            {mainError && (
              <div className="col-span-2 flex justify-end">
                <p className="text-sm text-destructive">{mainError}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default RootConfigPage
