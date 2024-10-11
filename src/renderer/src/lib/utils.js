import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const firstCharUpper = (text) => {
  const first = text.substring(0, 1).toUpperCase()
  const tail = text.substring(1).toLowerCase()
  return `${first}${tail}`
}
