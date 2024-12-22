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

export const calculateAgeFromRegister = (regNo) => {
  if (!regNo || regNo?.length < 10) {
    return undefined
  }
  const numbers = regNo?.substring(2)
  if (isNaN(numbers)) {
    return undefined
  }

  const years = numbers?.substring(0, 2)
  const months = numbers?.substring(2, 4)
  const days = numbers?.substring(4, 6)
  let realYears = 0
  let realMonths = Number(months)

  const nowYear = new Date().getFullYear()
  const nowMonth = new Date().getMonth()

  if (Number(months) > 12) {
    realYears = Number(years) + 2000
    realMonths = Number(months) - 20
    if (realMonths < 1) {
      return undefined
    }
    if (realYears > nowYear) {
      return undefined
    }
  } else {
    realYears = Number(years) + 1900
  }

  const lastDay = new Date(realYears, realMonths, 0).getDate()

  if (Number(days) < 1 || Number(days) > lastDay) {
    return undefined
  }

  let age = nowYear - realYears

  if (realMonths > nowMonth + 1) {
    age += 1
  }
  return {
    birthDate: `${realYears}-${`${realMonths}`.padStart(2, '0')}-${`${days}`.padStart(2, '0')}`,
    age: age
  }
}
