import { useState } from 'react'
import { Button } from '../ui/Button'
import { format } from 'date-fns'
import DataTable from '../ui/data-table'
import { RxDotsVertical, RxPlus } from 'react-icons/rx'
import WorkerCreateModal from '../worker-create-modal'
import { toast } from 'sonner'
import { Input } from '../ui/Input'
import ColumnVisible from '../ui/data-table/ColumnVisible'
import ColumnHeader from '../ui/data-table/ColumnHeader'
import { useUsers } from '../../context/users-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/Dropdown'
import { useAuth } from '../../context/auth-context'
import WorkerEditModal from '../worker-edit-modal'
import WorkerChangePasswordModal from '../worker-change-password'
import { Badge } from '../ui/Badge'

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
        <ColumnVisible
          table={table}
          columnNameData={[
            { name: 'ID', id: 'id' },
            { name: 'Нэвтрэх нэр', id: 'username' },
            { name: 'Нэр', id: 'displayName' },
            { name: 'Систем үүрэг', id: 'systemRole' },
            { name: 'Төлөв', id: 'isBlock' },
            { name: 'Албан тушаал', id: 'position' },
            { name: 'Үүрэг', id: 'role' },
            { name: 'Бүртгүүлсэн огноо', id: 'createdAt' }
          ]}
        />
      </div>
    </div>
  )
}

const WorkerSettings = () => {
  const { users, getUsers } = useUsers()
  const { user, token } = useAuth()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEditOpenModal, setIsEditOpenModal] = useState(false)
  const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState()

  const blockUser = async (data) => {
    const res = await window.api.blockUser(data, token)
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
      description:
        data.isBlock === 1
          ? 'Хэрэглэгчийг амжилттай блок хийлээ.'
          : 'Хэрэглэгчийг амжилттай идэвхижүүллээ.'
    })
    getUsers()
  }
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
      accessorKey: 'isBlock',
      header: () => <div className="text-center">Төлөв</div>,
      cell: ({ row }) => {
        const formatted = row.getValue('isBlock') === 1 ? 'Блоклогдсон' : 'Идэвхитэй'
        const colorClass =
          row.getValue('isBlock') === 1
            ? 'bg-gray-500 hover:bg-gray-500'
            : 'bg-green-500 hover:bg-green-500'
        return (
          <div className="text-center">
            <Badge className={colorClass}>{formatted}</Badge>
          </div>
        )
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

  if (user?.systemRole !== 'worker') {
    columns.push({
      accessorKey: 'action',
      header: ({ column }) => (
        <div className="flex-1 flex justify-end">
          <ColumnHeader column={column} title="Үйлдэл" />
        </div>
      ),
      cell: ({ row }) => {
        if (user?.username !== row.getValue('username')) {
          return (
            <div className="flex-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 flex">
                    <RxDotsVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedRow(row.original)
                        setIsEditOpenModal(true)
                      }}
                    >
                      Засах
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedRow(row.original)
                        setIsOpenChangePasswordModal(true)
                      }}
                    >
                      Нууц үг солих
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className={
                        row.original.isBlock === 0
                          ? 'text-destructive hover:!text-destructive'
                          : 'text-blue-500 hover:!text-blue-500'
                      }
                      onClick={() => {
                        blockUser({
                          userId: row.original.id,
                          isBlock: row.original.isBlock === 0 ? 1 : 0
                        })
                      }}
                    >
                      {row.original.isBlock === 0 ? 'Блоклох' : 'Идэвхжүүлэх'}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        }
        return null
      }
    })
  }

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
      {isEditOpenModal && (
        <WorkerEditModal
          open={isEditOpenModal}
          onHide={() => {
            setIsEditOpenModal(false)
            setSelectedRow(undefined)
          }}
          data={selectedRow}
          onSuccess={() => {
            setSelectedRow(undefined)
            getUsers()
          }}
        />
      )}
      {isOpenChangePasswordModal && (
        <WorkerChangePasswordModal
          open={isOpenChangePasswordModal}
          onHide={() => {
            setIsOpenChangePasswordModal(false)
            setSelectedRow(undefined)
          }}
          data={selectedRow}
          onSuccess={() => {
            setSelectedRow(undefined)
          }}
        />
      )}
    </>
  )
}

export default WorkerSettings
