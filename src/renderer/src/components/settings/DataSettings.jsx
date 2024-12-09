import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Label } from '../ui/Label'
import { GoFileDirectory } from 'react-icons/go'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useHospital } from '../../context/hospital-context'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/Select'

const DataSettings = () => {
  const { dataConfig, loadDataConfig } = useHospital()
  const [deviceList, setDeviceList] = useState([])

  const {
    handleSubmit,
    control,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      path: dataConfig?.directory,
      device: dataConfig?.device
    }
  })

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((d) => d.kind === 'videoinput')
      setDeviceList(videoDevices)
    }

    getDevices()
  }, [])

  const onSubmit = async (values) => {
    const token = localStorage.getItem('token')
    const res = await window.api.saveDataDirectory(values, token)
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
      description: 'Тохиргоо амжилттай хадгалагдлаа'
    })
    loadDataConfig()
  }

  const selectDirectory = async (value, onChange) => {
    const selectedDir = await window.electron.ipcRenderer.invoke('select-directory', value)
    onChange(selectedDir[0])
  }

  console.log('dataConfig ', dataConfig)
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

        <div className="grid grid-cols-2 mt-4">
          <Controller
            control={control}
            name={'device'}
            key={'device'}
            rules={{
              required: 'Төхөөрөмж сонгоно уу'
            }}
            render={({ field: { value, onChange, name }, fieldState: { error } }) => {
              return (
                <div className="flex-1 flex flex-col gap-1">
                  <Label htmlFor={name} className="pb-1">
                    Бичлэг хийх төхөөрөмж
                  </Label>
                  <Select id={name} name={name} value={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Сонгох" />
                    </SelectTrigger>
                    <SelectContent
                      data={deviceList?.map((item) => ({
                        value: item?.deviceId,
                        label: item?.label
                      }))}
                    />
                  </Select>
                  {error && <p className="text-sm text-destructive">{error.message}</p>}
                </div>
              )
            }}
          />
        </div>

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
