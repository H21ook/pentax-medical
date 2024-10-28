import { useEffect, useCallback, useState } from 'react'
import MainLayout from '../components/layouts/main-layout'
import DataTable from '../components/ui/data-table'
import { Button } from '../components/ui/Button'
import { RxCross2, RxPlus } from 'react-icons/rx'
import { format } from 'date-fns'
import ColumnVisible from '../components/ui/data-table/ColumnVisible'
import { Input } from '../components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/Select'
import ColumnHeader from '../components/ui/data-table/ColumnHeader'

const PatiantsTableHeader = ({ table, actions }) => {
  const isFiltered = table.getState().columnFilters.length > 0

  const clearFilters = () => {
    table.resetColumnFilters()
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Овог"
          value={table.getColumn('firstName')?.getFilterValue() ?? ''}
          onChange={(event) => table.getColumn('firstName')?.setFilterValue(event.target.value)}
          className="h-8 max-w-[200px]"
        />
        <Input
          placeholder="Нэр"
          value={table.getColumn('lastName')?.getFilterValue() ?? ''}
          onChange={(event) => table.getColumn('lastName')?.setFilterValue(event.target.value)}
          className="h-8 max-w-[200px]"
        />
        <Input
          placeholder="Төрсөн огноо"
          value={table.getColumn('birthDate')?.getFilterValue() ?? ''}
          onChange={(event) => table.getColumn('birthDate')?.setFilterValue(event.target.value)}
          className="h-8 max-w-[200px]"
        />
        <Select
          id={name}
          name={name}
          value={table.getColumn('city')?.getFilterValue() ?? ''}
          onValueChange={(value) => {
            table.getColumn('city')?.setFilterValue(value)
          }}
        >
          <SelectTrigger className="h-8 max-w-[200px]">
            <SelectValue placeholder="Хот/Аймаг" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Улаанбаатар">Улаанбаатар</SelectItem>
            <SelectItem value="Архангай">Архангай</SelectItem>
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button variant="secondary" onClick={clearFilters} className="h-8 px-2 lg:px-3">
            Арилгах
            <RxCross2 className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <ColumnVisible table={table} />
      </div>
    </div>
  )
}
const MainPage = () => {
  const fakeData = [
    {
      id: 5256,
      firstName: 'Өнөрсайхан',
      lastName: 'Хишигбаяр',
      birthDate: '1997-04-03',
      city: 'Архангай',
      district: 'Тариат',
      address: 'Гуанз хороолол',
      dataDirectory: 'D:\\pentax\\2024\\10-27\\5256',
      createdDate: '2024-10-27 10:24:09'
    },
    {
      id: 5255,
      firstName: 'Баатар',
      lastName: 'Сайнзаяа',
      birthDate: '1986-11-09',
      city: 'Улаанбаатар',
      district: 'БЗД',
      address: '26-р хороо Олимп',
      dataDirectory: 'D://pentax//2024//10-26//Сайнзаяа',
      createdDate: '2024-10-26 15:46:24'
    },
    {
      id: 5254,
      firstName: 'Өнөрсайхан',
      lastName: 'Хишигбаяр',
      birthDate: '1997-04-03',
      city: 'Архангай',
      district: 'Тариат',
      address: 'Гуанз хороолол',
      dataDirectory: 'D:\\pentax\\2024\\10-27\\5254',
      createdDate: '2024-10-27 10:24:09'
    },
    {
      id: 5253,
      firstName: 'Баатар',
      lastName: 'Сайнзаяа',
      birthDate: '1986-11-09',
      city: 'Улаанбаатар',
      district: 'БЗД',
      address: '26-р хороо Олимп',
      dataDirectory: 'D://pentax//2024//10-26//Сайнзаяа',
      createdDate: '2024-10-26 15:46:24'
    },
    {
      id: 5252,
      firstName: 'Өнөрсайхан',
      lastName: 'Хишигбаяр',
      birthDate: '1997-04-03',
      city: 'Архангай',
      district: 'Тариат',
      address: 'Гуанз хороолол',
      dataDirectory: 'D:\\pentax\\2024\\10-27\\5252',
      createdDate: '2024-10-27 10:24:09'
    },
    {
      id: 5251,
      firstName: 'Баатар',
      lastName: 'Сайнзаяа',
      birthDate: '1986-11-09',
      city: 'Улаанбаатар',
      district: 'БЗД',
      address: '26-р хороо Олимп',
      dataDirectory: 'D://pentax//2024//10-26//Сайнзаяа',
      createdDate: '2024-10-26 15:46:24'
    },
    {
      id: 5250,
      firstName: 'Өнөрсайхан',
      lastName: 'Хишигбаяр',
      birthDate: '1997-04-03',
      city: 'Архангай',
      district: 'Тариат',
      address: 'Гуанз хороолол',
      dataDirectory: 'D:\\pentax\\2024\\10-27\\5250',
      createdDate: '2024-10-27 10:24:09'
    },
    {
      id: 5249,
      firstName: 'Баатар',
      lastName: 'Сайнзаяа',
      birthDate: '1986-11-09',
      city: 'Улаанбаатар',
      district: 'БЗД',
      address: '26-р хороо Олимп',
      dataDirectory: 'D://pentax//2024//10-26//Сайнзаяа',
      createdDate: '2024-10-26 15:46:24'
    },
    {
      id: 5248,
      firstName: 'Өнөрсайхан',
      lastName: 'Хишигбаяр',
      birthDate: '1997-04-03',
      city: 'Архангай',
      district: 'Тариат',
      address: 'Гуанз хороолол',
      dataDirectory: 'D:\\pentax\\2024\\10-27\\5248',
      createdDate: '2024-10-27 10:24:09'
    },
    {
      id: 5247,
      firstName: 'Баатар',
      lastName: 'Сайнзаяа',
      birthDate: '1986-11-09',
      city: 'Улаанбаатар',
      district: 'БЗД',
      address: '26-р хороо Олимп',
      dataDirectory: 'D://pentax//2024//10-26//Сайнзаяа',
      createdDate: '2024-10-26 15:46:24'
    },
    {
      id: 5246,
      firstName: 'Өнөрсайхан',
      lastName: 'Хишигбаяр',
      birthDate: '1997-04-03',
      city: 'Архангай',
      district: 'Тариат',
      address: 'Гуанз хороолол',
      dataDirectory: 'D:\\pentax\\2024\\10-27\\5246',
      createdDate: '2024-10-27 10:24:09'
    },
    {
      id: 5245,
      firstName: 'Баатар',
      lastName: 'Сайнзаяа',
      birthDate: '1986-11-09',
      city: 'Улаанбаатар',
      district: 'БЗД',
      address: '26-р хороо Олимп',
      dataDirectory: 'D://pentax//2024//10-26//Сайнзаяа',
      createdDate: '2024-10-26 15:46:24'
    }
  ]
  // const [users, setUsers] = useState([])

  // const getUsers = useCallback(async () => {
  //   const res = await window.api.getAllUsers()
  //   setUsers(res || [])
  // }, [])

  // useEffect(() => {
  //   getUsers()
  // }, [getUsers])

  const columns = [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return <ColumnHeader column={column} title="Д/Д" />
      }
    },
    {
      accessorKey: 'firstName',
      header: 'Овог',
      cell: ({ row }) => {
        return <div className="text-start line-clamp-1">{row.getValue('firstName')}</div>
      }
    },
    {
      accessorKey: 'lastName',
      header: 'Нэр',
      cell: ({ row }) => {
        return <div className="text-start line-clamp-1">{row.getValue('lastName')}</div>
      }
    },
    {
      accessorKey: 'birthDate',
      header: 'Төрсөн огноо',
      cell: ({ row }) => {
        const formatted = format(new Date(row.getValue('birthDate')), 'yyyy-MM-dd')
        return <div className="min-w-[100px] text-start line-clamp-1">{formatted}</div>
      }
    },
    {
      accessorKey: 'city',
      header: 'Хот/Аймаг',
      cell: ({ row }) => {
        return <div className="text-start line-clamp-1 min-w-[100px]">{row.getValue('city')}</div>
      }
    },
    {
      accessorKey: 'district',
      header: 'Дүүрэг/Сум',
      cell: ({ row }) => {
        return (
          <div className="text-start line-clamp-1 min-w-[100px]">{row.getValue('district')}</div>
        )
      }
    },
    {
      accessorKey: 'address',
      header: 'Хаяг',
      cell: ({ row }) => {
        return (
          <div className="text-start truncate whitespace-nowrap">{row.getValue('address')}</div>
        )
      }
    },
    {
      accessorKey: 'dataDirectory',
      header: 'Файлын байршил',
      cell: ({ row }) => {
        return (
          <div className="text-start truncate whitespace-nowrap hover:underline hover:underline-offset-2 cursor-pointer">
            {row.getValue('dataDirectory')}
          </div>
        )
      }
    },
    {
      accessorKey: 'createdDate',
      header: 'Үзлэг огноо',
      cell: ({ row }) => {
        const formatted = format(new Date(row.getValue('createdDate')), 'yyyy-MM-dd HH:mm:ss')
        return <div className="text-start line-clamp-1 min-w-[140px]">{formatted}</div>
      }
    }
  ]

  return (
    <MainLayout>
      <div className="p-2">
        <DataTable
          columns={columns}
          data={fakeData}
          header={(table) => {
            return (
              <PatiantsTableHeader
                table={table}
                actions={
                  <Button variant="outline" className="h-8 px-2 lg:px-3" onClick={() => {}}>
                    <RxPlus className="mr-2" /> Үзлэг хийх
                  </Button>
                }
              />
            )
          }}
        />
      </div>
    </MainLayout>
  )
}

export default MainPage
