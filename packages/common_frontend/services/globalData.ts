import { Area } from '@erase/common/entity'
import { BartInstance } from '../config/config'

let scope: any

export const fetchScope = async () => {
  const res = await BartInstance.get('/campaignScope', { headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  }})
  const scope: Area[] = res.data
  setScope(scope)
  return scope
}

export const getScope = () => scope
export const setScope = (scopeData: any) => (scope = scopeData)
