const acronyms = ['uc', 'ucmo', 'aic', 'pid', 'imei', 'kpk']

export function toTitleCase(str: string | undefined) {
  if (str && acronyms.includes(str.toLowerCase())) return str.toUpperCase()
  if (str)
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })

  return ''
}

export function toFixedLength(str: string, length = 2) {
  if (!+str) return str

  if (!str.includes('.')) {
    return str
  } else {
    if (parseInt(str.split('.')[1]) == 0) {
      return str.split('.')[0]
    }
  }

  return (+str).toFixed(length)
}
