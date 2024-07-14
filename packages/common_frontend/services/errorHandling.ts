import { CommsService } from './communication'

const ERROR_MESSAGES = {
  400: 'Invalid inputs in request',
  401: 'You are not authorized to perform this operation',
  403: 'Forbidden resource',
  404: 'Resource not found',
  500: 'Internal system error. Please contact admin',
  504: 'Request failed due to timeout',
  default: 'Operation failed. Please contact admin',
}

export const genericApiErrorHandler = (error: any): void => {
  if (error.response) {
    const { status, data } = error.response
    const statusCode: keyof typeof ERROR_MESSAGES = status
    console.log(error)
    CommsService.error(data.message || ERROR_MESSAGES[statusCode] || ERROR_MESSAGES.default)
  } else if (error.request) {
    CommsService.error('Request failed')
  } else {
    CommsService.error('Error. Please check your network.')
  }
  throw error
}
