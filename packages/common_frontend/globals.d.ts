/* eslint-disable */
declare module '*.svg' {
  const content: string
  export default content
}

require('dotenv').config()
module.exports = {
  env: {
    INTRA_URL = process.env.INTRA_URL,
    LEGACY_URL = process.env.LEGACY_URL,
  },
}
