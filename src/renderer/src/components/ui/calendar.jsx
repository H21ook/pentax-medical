import { DayPicker } from 'react-day-picker'

import { buttonVariants } from './Button'
import { cn } from '../../lib/utils'
import { RxChevronLeft, RxChevronRight } from 'react-icons/rx'
import 'react-day-picker/dist/style.css'

function Calendar({ className, classNames, showOutsideDays = true, formatters, ...props }) {
  const monthsData = Array.from({ length: 12 }, (_, i) => `${i + 1}-р сар`)

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4 !flex flex-col items-center',
        caption: 'flex justify-between relative items-center gap-2',
        caption_label: 'text-sm font-medium',
        nav: 'gap-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 !border !border-input bg-transparent p-0 opacity-50 hover:opacity-100 hover:!bg-accent'
        ),
        nav_button_previous: '',
        nav_button_next: '',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:!bg-accent'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          '!bg-primary !text-primary-foreground hover:!bg-primary/80 hover:!text-primary-foreground focus:!bg-primary/80 focus:!text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames
      }}
      formatters={
        formatters || {
          formatCaption: (date) => {
            const monthIndex = date.getMonth()
            return `${date.getFullYear()} оны ${monthsData[monthIndex]}` // Display short month name only
          }
        }
      }
      components={{
        IconLeft: () => <RxChevronLeft className="h-4 w-4" />,
        IconRight: () => <RxChevronRight className="h-4 w-4" />
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
