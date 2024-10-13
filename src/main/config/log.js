import { app } from 'electron'
import Logger from 'electron-log'
import { join } from 'path'

Logger.transports.file.level = 'info'
Logger.transports.file.maxSize = 5 * 1024 * 1024 // 5 MB
// Customize the log file format
Logger.transports.file.format = '{h}:{i}:{s} {text}'
// Change log file location if needed
Logger.transports.file.resolvePathFn = () => join(app.getPath('logs'), 'runtime_error.log')

export const log = Logger
