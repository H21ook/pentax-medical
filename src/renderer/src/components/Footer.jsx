import { format } from 'date-fns'
import { mn } from 'date-fns/locale'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { RxExit } from 'react-icons/rx'
import { useRouter } from '../context/page-router'
import { useAuth } from '../context/auth-context'
import { firstCharUpper } from '../lib/utils'

const Footer = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const dateInterval = useRef()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    dateInterval.current = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => {
      clearInterval(dateInterval.current)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    router.restart()
  }

  return (
    <div className=" w-full border-t p-2 flex justify-between select-none items-center">
      <div className="flex flex-col items-start w-fit">
        <div className="text-xs font-semibold">
          {firstCharUpper(
            format(currentDate, 'EEEE ', {
              locale: mn
            })
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(currentDate, 'yyyy-MM-dd HH:mm:ss')}
        </div>
      </div>
      {user && (
        <div className="flex gap-2">
          <div className="flex items-center border rounded-md min-w-[120px]">
            <div className="px-2.5 rounded-md flex items-center gap-2">
              <div>
                <div className="text-xs leading-3 text-muted-foreground">{user?.position}</div>
                <div className="text-sm font-semibold">{user?.displayName}</div>
              </div>
            </div>
          </div>
          <Button size="icon" onClick={logout} className="rounded-full">
            <RxExit className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Footer
