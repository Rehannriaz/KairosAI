import { message } from 'antd'

export const ERROR_MESSAGES = {
  400: 'Invalid inputs in request',
  401: 'You are not authorized to perform this operation',
  403: 'Forbidden resource',
  404: 'Resource not found',
  500: 'Internal system error. Please contact admin',
  504: 'Request failed due to timeout',
  default: 'Operation failed. Please contact admin',
}

export const sortNumbersArray = (arr: number[]): number[] => arr.sort((a, b) => a - b)

export const sortStringsArray = (arr: string[]) => arr.sort((a, b) => a?.toString()?.localeCompare(b))

export function getUnique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr)).filter((x: any) => !!x)
}

export const convertToFilterableDropdown = (arr: (string | number)[]) => {
  return arr && Array.isArray(arr)
    ? arr.map((x: string | number) => {
        return {
          text: x.toString(),
          value: x,
        }
      })
    : []
}

export const convertPropertyIntoTableFilter = (data: any, property: string, config = { sortNumber: false }) => {
  if (data && Array.isArray(data)) {
    const dataVals = data.map((x: any) => x[property]).filter((x: any) => (typeof x !== 'boolean' ? !!x : x))
    return convertToFilterableDropdown(
      config.sortNumber ? sortNumbersArray(getUnique(dataVals)) : sortStringsArray(getUnique(dataVals))
    )
  }
}

export const isRenderedRoute = (route: string): boolean => {
  let path = location.pathname
  if (path[path.length - 1] === '/') path = path.slice(0, path.length - 1)

  return path === route
}

export const genericApiErrorHandler = (error: any): void => {
  if (error.response) {
    const { status, data } = error.response
    const statusCode: keyof typeof ERROR_MESSAGES = status
    message.error(data.message || ERROR_MESSAGES[statusCode] || ERROR_MESSAGES.default)
  } else if (error.request) {
    message.error('Request failed')
  } else {
    message.error('Error. Please check your network.')
  }
  throw error
}

export const GetQueryStringParams = (query: string) => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params: { [key: string]: string | undefined }, param) => {
          const [key, value] = param.split('=')
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : undefined
          return params
        }, {})
    : {}
}

export const sortObjects = (arr: any[], key: string): any[] => {
  if (!arr || !arr.sort) return arr
  return arr.sort((a: any, b: any): number => {
    if (a[key] < b[key]) return -1
    else if (a[key] > b[key]) return 1
    return 0
  })
}

export const isInvalidLatitude = (lat: string | number): boolean => {
  if (+lat === 0) return false
  return !lat || !+lat || isNaN(+lat) || lat < -90 || lat > 90
}

export const isInvalidLongititude = (lng: string | number): boolean => {
  if (+lng === 0) return false
  return !lng || !+lng || isNaN(+lng) || lng < -180 || lng > 180
}

export const wait = (ms: number): Promise<void> => {
  return new Promise((res) => setTimeout(res, ms))
}

/**
 * Checks if a given input is a valid number value to be shown on UI
 * @param val any input
 * @returns flag denoting number is safe to display or not
 */
export function isSafeNumber(val: any): boolean {
  if (val === null || val === undefined) return false
  if (isNaN(val) || isNaN(+val)) return false
  if (typeof val === 'string' && val.trim() === '') return false

  return true
}

/**
 * Converts a number to a safe string that can be displayed on UI
 * @param x given input
 * @returns string to-be-displayed
 */
export function convertNumberToSafeString(x: any): string {
  if (isSafeNumber(x)) return x
  return 'N/A'
}

export function trimStringArray(arr: string[]) {
  return arr.map((v: string) => v.trim())
}
