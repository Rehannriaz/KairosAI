import { IntraInstance } from '../config/config'
import { genericApiErrorHandler } from './errorHandling'
import { getUser } from './bartApi'

// wrapper for one-place error handling
export const IntraApi = {
  get: (url: string, params?: any): Promise<any> => {
    return IntraInstance.get(url, params).catch(genericApiErrorHandler)
  },
  post: (url: string, payload: any) => {
    const user = getUser()
    return IntraInstance.post(url, payload, {
      params: {
        updatedBy: user ? user.id : null,
      },
    }).catch(genericApiErrorHandler)
  },
  put: (url: string, payload: any) => {
    const user = getUser()
    return IntraInstance.put(url, payload, {
      params: {
        updatedBy: user ? user.id : null,
      },
    }).catch(genericApiErrorHandler)
  },
  patch: (url: string, payload: any) => {
    const user = getUser()
    return IntraInstance.patch(url, payload, {
      params: {
        updatedBy: user ? user.id : null,
      },
    }).catch(genericApiErrorHandler)
  },
}
