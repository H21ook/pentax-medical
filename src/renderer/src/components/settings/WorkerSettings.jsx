import { useState } from 'react'
import { Button } from '../ui/Button'
import { format } from 'date-fns'
import DataTable from '../ui/data-table'
import { RxPlus } from 'react-icons/rx'
import WorkerCreateModal from '../worker-create-modal'
import { toast } from 'sonner'
import { Input } from '../ui/Input'
import ColumnVisible from '../ui/data-table/ColumnVisible'
import ColumnHeader from '../ui/data-table/ColumnHeader'
import { useUsers } from '../../context/users-context'

const WorkerTableHeader = ({ table, actions }) => {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Нэвтрэх нэр"
        value={table.getColumn('username')?.getFilterValue() ?? ''}
        onChange={(event) => table.getColumn('username')?.setFilterValue(event.target.value)}
        className="h-8 max-w-[300px]"
      />
      <div className="flex items-center gap-2">
        {actions}
        <ColumnVisible table={table} />
      </div>
    </div>
  )
}

const WorkerSettings = () => {
  const { users, getUsers } = useUsers()
  const [isOpenModal, setIsOpenModal] = useState(false)

  const columns = [
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return <ColumnHeader column={column} title="Нэвтрэх нэр" />
      }
    },
    {
      accessorKey: 'displayName',
      header: 'Нэр'
    },
    {
      accessorKey: 'systemRole',
      header: () => <div className="text-center">Систем үүрэг</div>,
      cell: ({ row }) => {
        const formatted = row.getValue('systemRole') === 'admin' ? 'Админ' : 'Ажилтан'
        return <div className="text-center">{formatted}</div>
      }
    },
    {
      accessorKey: 'position',
      header: 'Албан тушаал'
    },
    {
      accessorKey: 'role',
      header: () => <div className="text-center">Үүрэг</div>,
      cell: ({ row }) => {
        const formatted = row.getValue('role') === 'doctor' ? 'Эмч' : 'Сувилагч'
        return <div className="text-center">{formatted}</div>
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div className="flex-1 flex justify-end">
          <ColumnHeader column={column} title="Бүртгүүлсэн огноо" />
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
          header={(table) => {
            return (
              <WorkerTableHeader
                table={table}
                actions={
                  <Button
                    variant="outline"
                    className="h-8 px-2 lg:px-3"
                    onClick={() => {
                      setIsOpenModal(true)
                    }}
                  >
                    <RxPlus className="me-2" /> Ажилтан нэмэх
                  </Button>
                }
              />
            )
          }}
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
