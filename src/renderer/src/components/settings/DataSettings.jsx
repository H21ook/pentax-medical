import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '../../context/auth-context'
import { useRouter } from '../../context/page-router'
import { toast } from 'sonner'
import { Label } from '../ui/Label'
import { GoFileDirectory } from 'react-icons/go'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useHospital } from '../../context/hospital-context'

const DataSettings = () => {
  const { checkLogged } = useAuth()
  const router = useRouter()
  const { dataConfig } = useHospital()

  const {
    handleSubmit,
    control,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      path: dataConfig?.directory
    }
  })

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

  const selectDirectory = async (value, onChange) => {
    const selectedDir = await window.electron.ipcRenderer.invoke('select-directory', value)
    onChange(selectedDir[0])
  }

  return (
    <div className="w-full">
      <h1 className="font-semibold mb-4 mt-2">Дата, хадгалалт тохиргоо</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
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
                    <Input
                      id={name}
                      name={name}
                      value={value}
                      readOnly={true}
                      className="ps-8 w-full"
                      onChange={() => {}}
                    />
                  </div>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => selectDirectory(value, onChange)}
                  >
                    Browse
                  </Button>
                </div>
              </div>
            )
          }}
        />
        <div className="w-full flex justify-end mt-4">
          <Button type="submit" disabled={!isDirty}>
            Хадгалах
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DataSettings
