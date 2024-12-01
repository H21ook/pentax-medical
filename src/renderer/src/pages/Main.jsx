import MainLayout from '../components/layouts/main-layout'
import DataTable from '../components/ui/data-table'
import { Button } from '../components/ui/Button'
import { RxCross2, RxPlus } from 'react-icons/rx'
import ColumnVisible from '../components/ui/data-table/ColumnVisible'
import { Input } from '../components/ui/Input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../components/ui/Select'
import ColumnHeader from '../components/ui/data-table/ColumnHeader'
import NewTab from '../components/main/NewTab'
import { ScrollArea, ScrollBar } from '../components/ui/ScrollArea'
import DetailTab from '../components/main/DetailTab'
import { useNewData } from '../context/new-data-context'
import { useUsers } from '../context/users-context'
import { useAddress } from '../context/address-context'

const PatiantsTableHeader = ({ table, actions }) => {
  const { parentAddress } = useAddress()
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
          value={table.getColumn('cityId')?.getFilterValue() ?? ''}
          onValueChange={(value) => {
            table.getColumn('cityId')?.setFilterValue(value)
          }}
        >
          <SelectTrigger className="h-8 max-w-[200px]">
            <SelectValue placeholder="Хот/Аймаг" />
          </SelectTrigger>
          <SelectContent
            data={parentAddress?.map((item) => ({
              value: item?.id,
              label: item?.name
            }))}
          />
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
  const { employees } = useUsers()
  const { allAddressData } = useAddress()
  const { selectedTab, tabs, setSelectedTab, removeTab, addDetailTab, addNewTab } = useNewData()

  const selectedRows = tabs?.filter((item) => item.type === 'detail')?.map((item) => item.id) || []

  const columns = [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return <ColumnHeader column={column} title="ID" />
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
      accessorKey: 'regNo',
      header: 'РД',
      cell: ({ row }) => {
        return (
          <div className="min-w-[100px] text-start line-clamp-1 uppercase">
            {row.getValue('regNo')}
          </div>
        )
      }
    },
    {
      accessorKey: 'birthDate',
      header: 'Төрсөн огноо',
      cell: ({ row }) => {
        return (
          <div className="min-w-[100px] text-start line-clamp-1">{row.getValue('birthDate')}</div>
        )
      }
    },
    {
      accessorKey: 'gender',
      header: 'Хүйс',
      cell: ({ row }) => {
        const value = row.getValue('gender')
        return (
          <div className="text-start truncate whitespace-nowrap">
            {value === 'male' ? 'Эр' : value === 'female' ? 'Эм' : 'Бусад'}
          </div>
        )
      }
    },
    {
      accessorKey: 'cityId',
      header: 'Хот/Аймаг',
      cell: ({ row }) => {
        const id = row.getValue('cityId')
        const address = allAddressData?.find((addr) => addr.id === id)

        return <div className="text-start line-clamp-1 min-w-[100px]">{address?.name}</div>
      }
    },
    {
      accessorKey: 'districtId',
      header: 'Дүүрэг/Сум',
      cell: ({ row }) => {
        const id = row.getValue('districtId')
        const address = allAddressData?.find((addr) => addr.id === id)
        return <div className="text-start line-clamp-1 min-w-[100px]">{address?.name}</div>
      }
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Утасны дугаар',
      cell: ({ row }) => {
        return (
          <div className="min-w-[100px] text-start line-clamp-1 uppercase">
            {row.getValue('phoneNumber')}
          </div>
        )
      }
    },
    {
      accessorKey: 'type',
      header: 'Үзлэгийн төрөл',
      cell: ({ row }) => {
        const value = row.getValue('type')
        return (
          <div className="text-start line-clamp-1 min-w-[140px]">
            {value === 'lower' ? 'Lower GI' : 'Upper GI'}
          </div>
        )
      }
    },
    {
      accessorKey: 'date',
      header: 'Үзлэг огноо',
      cell: ({ row }) => {
        return <div className="text-start line-clamp-1 min-w-[140px]">{row.getValue('date')}</div>
      }
    },
    {
      accessorKey: 'folderPath',
      header: 'Файлын байршил',
      cell: ({ row }) => {
        const folderPath = row.getValue('folderPath')
        return (
          <div
            className="text-start truncate whitespace-nowrap hover:underline hover:underline-offset-2 cursor-pointer"
            onClick={async () => {
              await window.api.openFolder(folderPath)
            }}
          >
            {folderPath}
          </div>
        )
      }
    }
  ]

  return (
    <MainLayout>
      <div>
        <div className="py-2 pb-0 border-b">
          <ScrollArea className="w-full whitespace-nowrap ">
            <div className="flex gap-1 mb-2 px-4">
              {tabs.map((item, index) => {
                return (
                  <div
                    key={`tab_${index}`}
                    onClick={() => {
                      setSelectedTab(index)
                    }}
                    className={`w-fit cursor-pointer px-2 py-1 text-sm rounded-md flex items-center gap-2 ${index === selectedTab ? 'bg-gray-200 hover:bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}
                  >
                    {item.name}
                    {index > 0 ? (
                      <div
                        className="group hover:bg-white rounded-full p-[2px]"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTab(index)
                        }}
                      >
                        <RxCross2 className="transition-all duration-300 text-gray-500 group-hover:text-black" />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <ScrollArea className="w-full px-2 h-[calc(100vh-174px)]">
          <div className="py-6">
            {tabs.map((item, index) => {
              if (item.type === 'base') {
                return (
                  <div
                    key={`tabData_${index}`}
                    className={`px-2 ${index === selectedTab ? 'block' : 'hidden'}`}
                  >
                    <DataTable
                      columns={columns}
                      data={employees}
                      selectedRows={new Set(selectedRows)}
                      onRowDoubleClick={(row) => {
                        addDetailTab(row.original)
                      }}
                      header={(table) => {
                        return (
                          <PatiantsTableHeader
                            table={table}
                            actions={
                              <Button
                                variant="outline"
                                className="h-8 px-2 lg:px-3"
                                onClick={addNewTab}
                              >
                                <RxPlus className="mr-2" /> Шинэ үзлэг
                              </Button>
                            }
                          />
                        )
                      }}
                    />
                  </div>
                )
              }
              if (item.type === 'detail') {
                return (
                  <div
                    className={`${index === selectedTab ? 'block' : 'hidden'}`}
                    key={`tabData_${index}`}
                  >
                    <DetailTab key={item.name} />
                  </div>
                )
              }
              return (
                <div
                  className={`${index === selectedTab ? 'block' : 'hidden'}`}
                  key={`tabData_${index}`}
                >
                  <NewTab key={item.name} />
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  )
}

export default MainPage
