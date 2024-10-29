import { format as dateFormatter } from 'date-fns'
import { mn } from 'date-fns/locale'
import { Button } from './Button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '../../lib/utils'
import { useEffect, useState } from 'react'
import { RxArrowLeft, RxChevronLeft, RxChevronRight, RxCross2 } from 'react-icons/rx'

export function TreeDatePicker({
  id,
  value,
  onChange = () => {},
  className,
  placeholder,
  format = 'yyyy-MM-dd',
  defaultYear = new Date().getFullYear()
}) {
  const dateValue = value ? new Date(value) : undefined
  const [page, setPage] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState()
  const [selectedMonth, setSelectedMonth] = useState()
  const [years, setYears] = useState([])

  const monthsData = Array.from({ length: 12 }, (_, i) => `${i + 1}-р сар`)
  useEffect(() => {
    const pageSize = 18
    const getPageOfYear = (yearsData, inputYear) => {
      const yearIndex = yearsData.indexOf(inputYear)
      if (yearIndex === -1) {
        return undefined
      }

      const pageNumber = Math.floor(yearIndex / pageSize) + 1
      return pageNumber
    }

    const nowYear = new Date().getFullYear()
    const data = Array.from({ length: 126 }, (_, i) => nowYear - 125 + i)
    const initPage = getPageOfYear(data, defaultYear)
    setYears(data)
    setPage(initPage)
  }, [defaultYear])

  const paginateYears = (pageNumber) => {
    const pageSize = 18
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = startIndex + pageSize
    return years.slice(startIndex, endIndex)
  }

  const clearValue = () => {
    setSelectedYear(undefined)
    setSelectedMonth(undefined)
    onChange(undefined)
  }

  const yearPageRender = (_page) => {
    const pageData = paginateYears(_page)
    return (
      <div className="p-3 m-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{`${pageData[0]}-${pageData[pageData.length - 1]} он`}</div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              disabled={_page === 1}
              onClick={() => {
                setPage((prev) => prev - 1)
              }}
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent"
            >
              <RxChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPage((prev) => prev + 1)
              }}
              disabled={_page === 7}
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent"
            >
              <RxChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 mt-4">
          {paginateYears(_page).map((item, index) => {
            return (
              <Button
                key={`page_${_page}_${index}`}
                variant="ghost"
                className="h-8 p-0"
                onClick={() => {
                  setSelectedYear(item)
                }}
              >
                {item}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  const monthPageRender = () => {
    return (
      <div className="p-3 m-4">
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedYear(undefined)
              }}
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent"
            >
              <RxArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">{selectedYear} он</div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="outline"
              disabled={selectedYear === years[0]}
              onClick={() => {
                setSelectedYear((prev) => prev - 1)
              }}
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent"
            >
              <RxChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedYear((prev) => prev + 1)
              }}
              disabled={selectedYear === years[years.length - 1]}
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent"
            >
              <RxChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 mt-4">
          {monthsData.map((item, index) => {
            return (
              <Button
                key={`month_${item}`}
                variant="ghost"
                className="h-8 p-0"
                onClick={() => {
                  setSelectedMonth(index + 1)
                }}
              >
                {item}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }
  return (
    <Popover
      id={id}
      open={isOpen}
      onOpenChange={(e) => {
        if (e === false) {
          setIsOpen(e)
          if (!value) {
            clearValue()
          }
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
            'justify-start text-left font-normal px-3 hover:bg-background',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {value ? (
            <div className="w-full flex items-center justify-between">
              <span>{dateFormatter(dateValue, format)}</span>{' '}
              <div
                className="h-5 w-5 flex items-center justify-center transition-all duration-300 rounded-full hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation()
                  clearValue()
                }}
              >
                <RxCross2 className="h-4 w-4 " />
              </div>
            </div>
          ) : (
            <span>{placeholder || 'Сонгох'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {selectedYear && selectedMonth ? (
          <Calendar
            mode="single"
            selected={dateValue}
            locale={mn}
            defaultMonth={new Date(selectedYear, selectedMonth - 1, 1)}
            onSelect={(e) => {
              onChange(dateFormatter(e, format))
              setIsOpen(false)
            }}
          />
        ) : (
          <div className="w-[280px]">
            {!selectedYear ? yearPageRender(page) : monthPageRender()}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
