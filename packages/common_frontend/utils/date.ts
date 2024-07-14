export function DateToYMD(passedDate: Date | undefined, separator = '-') {
  if (!passedDate) return ''
  const date = passedDate.getDate()
  const month = passedDate.getMonth() + 1
  const year = passedDate.getFullYear()

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
}

export function DateToDMY(date: Date) {
  const dateString = date.toLocaleDateString().split('/')
  return dateString[1].concat('-', dateString[0], '-', dateString[2])
}

export function YMDtoDMY(date: string) {
  const dateString = date.split('-')
  return dateString[2].concat('-', dateString[1], '-', dateString[0])
}

export const toISOString = (val: Date) => {
  const offset = val.getTimezoneOffset()
  const date = new Date(val.getTime() - offset * 60 * 1000)
  return date.toISOString().slice(0, 10)
}

export function getCurrentDate(separator = '-', format = 'YMD') {
  const newDate = new Date()
  const date = newDate.getDate()
  const month = newDate.getMonth() + 1
  const year = newDate.getFullYear()
  if (format === 'timestring') {
    return newDate.setHours(0, 0, 0, 0).toString()
  }
  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
}
