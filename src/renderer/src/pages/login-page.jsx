import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Header from '../components/Header'
import { Button } from '../components/ui/Button'
import { useRouter } from '../context/page-router'
import { Label } from '../components/ui/Label'
import { Input } from '../components/ui/Input'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx'
import { useAuth } from '../context/auth-context'

export const LoginPage = () => {
  const router = useRouter()
  const { checkLogged } = useAuth()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const [showPass, setShowPass] = useState(false)
  const [loginError, setLoginError] = useState()

  const onSubmit = async (values) => {
    setLoginError('')
    const res = await window.api.login(values)
    if (!res.result) {
      setLoginError(res.message)
      return
    }

    localStorage.setItem('token', res.data?.token)
    checkLogged()
    router.push('main')
  }

  return (
    <div className="h-full w-full bg-vite-bg bg-no-repeat bg-cover">
      <Header />
      <div className="h-[80vh] w-full flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[360px] flex flex-col gap-2 select-none"
        >
          <Controller
            control={control}
            name={'username'}
            rules={{
              required: 'Нэвтрэх нэр оруулна уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="col-span-2 flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Нэвтрэх нэр
                  </Label>
                  <Input
                    id={name}
                    name={name}
                    value={value}
                    className="bg-background"
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
            name={'password'}
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
                      className="bg-background"
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
          <Button type="submit">Нэвтрэх</Button>
          {loginError && <p className="text-sm text-destructive">{loginError}</p>}
        </form>
      </div>
    </div>
  )
}
