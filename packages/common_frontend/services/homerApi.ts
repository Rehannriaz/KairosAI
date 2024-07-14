import { HomerInstance } from '../config/config'
import { genericApiErrorHandler } from './errorHandling'
import { getUser } from './bartApi'

export const HomerApi = {
  get: (url: string, params?: any): Promise<any> => {
    return HomerInstance.get(url, params).catch(genericApiErrorHandler)
  },
  post: (url: string, payload: any, config: any) => {
    const user = getUser()
    return HomerInstance.post(url, payload, {
      params: {
        updatedBy: user ? user.id : null,
      },
      ...config,
    }).catch(genericApiErrorHandler)
  },
  put: (url: string, payload: any):Promise<any> => {
    const user = getUser()
    return HomerInstance.put(url, payload, {
      params: {
        updatedBy: user ? user.id : null,
      },
    }).catch(genericApiErrorHandler)
  },
}
