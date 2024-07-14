import { BartInstance } from '../config/config'
import { genericApiErrorHandler } from './errorHandling'

let user: any

export const getUser = () => user

export const setUser = (userData: any) => (user = userData)

// wrapper for one-place error handling
export const BartApi = {
  get: (url: string, params?: any): Promise<any> => {
    return BartInstance.get(url, params).catch(genericApiErrorHandler)
  },
  post: (url: string, payload: any) => {
    const user = getUser()
    return BartInstance.post(url, payload, {
      params: {
        updatedBy: user ? user.id : null,
      },
    }).catch(genericApiErrorHandler)
  },
  put: (url: string, payload: any) => {
    const user = getUser()
    return BartInstance.put(url, payload, {
      params: {
        updatedBy: user ? user.id : null,
      },
    }).catch(genericApiErrorHandler)
  },
  patch: (url: string, payload: any) => {
    const user = getUser()
    return BartInstance.patch(url, payload, {
      params: {
        updatedBy: user ? user.id : null,
      },
    }).catch(genericApiErrorHandler)
  },
  delete: (url: string, params?: any): Promise<any> => {
    const user = getUser()
    return BartInstance.delete(url, {
      params: {
        ...params,
        updatedBy: user ? user.id : null,
      },
    }).catch(genericApiErrorHandler)
  },
}
