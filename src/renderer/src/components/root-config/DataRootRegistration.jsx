import animationJson from '../../assets/animation1.json'
import Lottie from 'lottie-react'
import { Button } from '../ui/Button'
import { useRouter } from '../../context/page-router'
import { useAuth } from '../../context/auth-context'
import { Controller, useForm } from 'react-hook-form'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { GoFileDirectory } from 'react-icons/go'
import { useEffect } from 'react'
import { toast } from 'sonner'

const DataRootRegistration = () => {
  const { checkLogged } = useAuth()
  const router = useRouter()

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      path: ''
    }
  })

  useEffect(() => {
    const getDocumentPath = async () => {
      const path = await window.electron.ipcRenderer.invoke('create-documents-path')
      console.log('path', path)
      setValue('path', path)
    }
    getDocumentPath()
  }, [])

  const onSubmit = async ({ path }) => {
    const token = localStorage.getItem('token')
    const res = await window.api.saveDataDirectory({ path, token })
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

    await checkLogged()
    router.change('main')
  }

  return (
    <div className="flex h-full items-center">
      <div className="w-[360px]">
        <Lottie animationData={animationJson} />
      </div>
      <div className="flex-1 flex flex-col items-start justify-between pe-8 py-12">
        <div className="flex flex-col items-start">
          <p className="font-bold text-2xl mb-2">Дата, өгөгдөл хадгалах</p>
          <p className="text-dimmed text-start text-sm">
            Та доорх мэдээллийг бүрэн гүйцэт үнэн зөв оруулна уу. Тус мэдээлэл нь энэхүү программаас
            гарах тайлан, мэдээллүүдэд хэрэглэгдэх юм.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-8">
          <Controller
            control={control}
            name={'path'}
            key={'path'}
            render={({ field: { value, onChange, name } }) => {
              return (
                <div className="flex flex-col items-start gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Дата хадгалах байршил
                  </Label>
                  <div className="flex gap-1 w-full">
                    <div className="relative w-full">
                      <div className="absolute h-full w-8 flex items-center  justify-center">
                        <GoFileDirectory />
                      </div>
                      <Input id={name} name={name} value={value} className="ps-8 w-full" />
                    </div>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={async () => {
                        const selectedDir = await window.electron.ipcRenderer.invoke(
                          'select-directory',
                          value
                        )
                        onChange(selectedDir[0])
                      }}
                    >
                      Browse
                    </Button>
                  </div>
                </div>
              )
            }}
          />
          <div className="w-full flex justify-end mt-[200px]">
            <Button type="submit">Хадгалах</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DataRootRegistration
