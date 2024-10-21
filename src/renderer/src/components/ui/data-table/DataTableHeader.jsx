import { Input } from '../Input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '../Dropdown'
import { Button } from '../Button'

const DataTableHeader = ({ table, actions }) => {
  return (
    <div className="flex items-center py-4 justify-between">
      <Input
        placeholder="Нэвтрэх нэр"
        value={table.getColumn('username')?.getFilterValue() ?? ''}
        onChange={(event) => table.getColumn('username')?.setFilterValue(event.target.value)}
        className="max-w-[425px]"
      />
      <div className="flex items-center gap-2">
        {actions}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Баганууд</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default DataTableHeader
