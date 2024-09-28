import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { RxExit } from 'react-icons/rx'

const Footer = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const dateInterval = useRef()

  useEffect(() => {
    dateInterval.current = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => {
      clearInterval(dateInterval.current)
    }
  }, [])

  return (
    <div className=" w-full border-t p-2 flex justify-between select-none items-center">
      <div className="flex flex-col items-start w-fit">
        <div className="text-xs font-semibold">{format(currentDate, 'EEEE ')}</div>
        <div className="text-xs text-muted-foreground">
          {format(currentDate, 'yyyy-MM-dd HH:mm:ss')}
        </div>
      </div>
      <div className="flex items-center border rounded-md">
        <div className="px-2.5 rounded-md flex items-center gap-2">
          <div>
            <div className="text-xs leading-3 text-muted-foreground">Эмч</div>
            <div className="text-sm font-semibold">А.Туяасайхан</div>
          </div>
        </div>
        <Button size="icon">
          <RxExit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Footer
