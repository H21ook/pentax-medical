import { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { LuArrowUpDown } from 'react-icons/lu'
import { format } from 'date-fns'
import DataTable from '../ui/data-table'
import { RxPlus } from 'react-icons/rx'
import WorkerCreateModal from '../worker-create-modal'
import { toast } from 'sonner'

const WorkerSettings = () => {
  const [users, setUsers] = useState([])
  const [isOpenModal, setIsOpenModal] = useState(false)

  const getUsers = useCallback(async () => {
    const res = await window.api.getAllUsers()
    setUsers(res)
  }, [])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const columns = [
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent"
          >
            Нэвтрэх нэр
            <LuArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      }
    },
    {
      accessorKey: 'displayName',
      header: 'Нэр'
    },
    {
      accessorKey: 'position',
      header: 'Албан тушаал'
    },
    {
      accessorKey: 'role',
      header: () => <div className="text-center">Үүрэг</div>,
      cell: ({ row }) => {
        const formatted = row.getValue('role') === 'admin' ? 'Админ' : 'Ажилтан'
        return <div className="text-center">{formatted}</div>
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div className="flex-1 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent text-end"
          >
            Бүртгүүлсэн огноо
            <LuArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const formatted = format(new Date(row.getValue('createdAt')), 'yyyy-MM-dd HH:mm:ss')

        return <div className="text-right">{formatted}</div>
      }
    }
  ]

  return (
    <>
      <div>
        <h1 className="font-semibold mb-4 mt-2">Ажилчдын жагсаалт</h1>
        <DataTable
          columns={columns}
          data={users}
          actions={
            <Button
              variant="outline"
              onClick={() => {
                setIsOpenModal(true)
              }}
            >
              <RxPlus className="me-2" /> Ажилтан нэмэх
            </Button>
          }
        />
      </div>
      <WorkerCreateModal
        open={isOpenModal}
        onHide={() => {
          setIsOpenModal(false)
        }}
        onSuccess={() => {
          toast.success('Амжилттай', {
            action: {
              label: 'Хаах',
              onClick: () => {}
            },
            duration: 3000,
            description: 'Ажилтан амжилттай бүртгэгдлээ',
            richColors: true
          })
          getUsers()
        }}
      />
    </>
  )
}

export default WorkerSettings
