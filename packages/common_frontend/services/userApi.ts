import { UserServiceInstance } from '../config/config'
import { genericApiErrorHandler } from './errorHandling'
import { getUser } from './bartApi'
// wrapper for one-place error handling
export const UsersApi = {
  get: (url: string, queryParams: any = {}): Promise<any> => {
    return UserServiceInstance.get(url, {
      params: {
        ...queryParams,
      },
    }).catch(genericApiErrorHandler)
  },
  post: (url: string, payload: any, queryParams: any = {}) => {
    const user = getUser()
    return UserServiceInstance.post(url, payload, {
      params: {
        updatedBy: user ? user.ID : null,
        ...queryParams,
      },
    }).catch(genericApiErrorHandler)
  },
  put: (url: string, payload: any) => {
    const user = getUser()
    return UserServiceInstance.put(url, payload, {
      params: {
        updatedBy: user ? user.ID : null,
      },
    }).catch(genericApiErrorHandler)
  },
  patch: (url: string, payload: any, queryParams: any = {}) => {
    const user = getUser()
    return UserServiceInstance.patch(url, payload, {
      params: {
        updatedBy: user ? user.ID : null,
        ...queryParams,
      },
    }).catch(genericApiErrorHandler)
  },
  delete: (url: string, queryParams: any = {}) => {
    const user = getUser()
    return UserServiceInstance.delete(url, {
      params: {
        updatedBy: user ? user.ID : null,
        ...queryParams,
      },
    }).catch(genericApiErrorHandler)
  },
}
