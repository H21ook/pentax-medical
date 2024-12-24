import { useEffect, useState } from 'react'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from '../Table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
// import { DataTablePagination } from './DataTablePagination'

const DataTable = ({
  columns,
  data,
  header = () => {},
  scrollClassname,
  selectedRows,
  onRowDoubleClick = () => {},
  selectedRowClassname = () => {}
}) => {
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  // const [pagination, setPagination] = useState({
  //   pageIndex: 0,
  //   pageSize: 10
  // })
  const [columnFilters, setColumnFilters] = useState([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility
      // pagination
    }
  })

  useEffect(() => {
    table.getRowModel().rows.forEach((row) => {
      if (selectedRows) {
        const shouldSelect = selectedRows?.has(row.original.id)
        row.toggleSelected(shouldSelect)
      } else {
        row.toggleSelected(false)
      }
    })
  }, [selectedRows, table])

  return (
    <div className="overflow-y-auto">
      {header(table)}
      <div className="rounded-md border my-4">
        <Table scrollClassname={scrollClassname}>
          <TableHeader className="sticky top-0 z-[2]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={header?.className}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onDoubleClick={() => {
                    onRowDoubleClick(row)
                  }}
                  className={selectedRowClassname(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Мэдээлэл олдсонгүй
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <DataTablePagination table={table} /> */}
      <div className="flex items-center justify-end">
        <div className="flex w-fit items-center text-sm font-medium whitespace-nowrap">
          Нийт: {table.getCoreRowModel().rows.length} мөр
        </div>
      </div>
    </div>
  )
}

export default DataTable
