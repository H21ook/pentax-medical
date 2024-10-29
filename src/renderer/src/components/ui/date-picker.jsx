import { format as dateFormatter } from 'date-fns'
import { mn } from 'date-fns/locale'
import { Button } from './Button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '../../lib/utils'
import { LuCalendar } from 'react-icons/lu'
import { useState } from 'react'

export function DatePicker({
  id,
  value,
  onChange = () => {},
  className,
  placeholder,
  format = 'yyyy-MM-dd',
  hideIcon = false,
  defaultMonth
}) {
  const dateValue = value ? new Date(value) : undefined
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      id={id}
      open={isOpen}
      onOpenChange={(e) => {
        if (e === false) {
          setIsOpen(e)
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          onClick={() => {
            setIsOpen(true)
          }}
          className={cn(
            'justify-start text-left font-normal px-3',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {!hideIcon ? <LuCalendar className="mr-2 h-4 w-4" /> : null}
          {value ? dateFormatter(dateValue, format) : <span>{placeholder || 'Сонгох'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          locale={mn}
          defaultMonth={defaultMonth}
          onSelect={(e) => {
            onChange(dateFormatter(e, format))
            setIsOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
