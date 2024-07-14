import { Modal } from 'antd'
const defaultModalAttributes = {
  closable: true,
}
export const CommsService = {
  success: (content: string, title = 'Success!') =>
    Modal.success({
      title,
      content,
      ...defaultModalAttributes,
    }),

  error: (content: string, title = 'Error!') =>
    Modal.error({
      title,
      content,
      ...defaultModalAttributes,
    }),

  info: (content: string, title = 'Note') =>
    Modal.info({
      title,
      content,
      ...defaultModalAttributes,
    }),

  warn: (content: string, title = 'Warning!') =>
    Modal.warn({
      title,
      content,
      ...defaultModalAttributes,
    }),
}
