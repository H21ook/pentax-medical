import { app } from 'electron'
import Logger from 'electron-log'
import { join } from 'path'


export const getTodayName = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

Logger.transports.file.level = 'info'
Logger.transports.file.maxSize = 5 * 1024 * 1024 // 5 MB
// Customize the log file format
Logger.transports.file.format = '{h}:{i}:{s} {text}'

// Change log file location if needed
Logger.transports.file.resolvePathFn = () => join(app.getPath('logs'), `${getTodayName()}.log`)

export const log = Logger
