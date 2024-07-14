export const hierarchyCols = [
  {
    title: 'Province',
    key: 'province',
    dataIndex: 'province',
  },
  {
    title: 'District',
    key: 'district',
    dataIndex: 'district',
  },
  {
    title: 'Tehsil',
    key: 'tehsil',
    dataIndex: 'tehsil',
  },
  {
    title: 'UC',
    key: 'uc',
    dataIndex: 'uc',
  },
]

export const staffCols = [
  {
    title: 'Facilitator/Supervisor',
    key: 'facilitator_supervisor',
    dataIndex: 'facilitator_supervisor'
  },

  {
    title: 'UC Staff',
    key: 'ucmo',
    dataIndex: 'ucmo',
  },
  {
    title: 'AIC',
    key: 'aic',
    dataIndex: 'aic',
  },
  {
    title: 'Team No',
    key: 'teamNo',
    dataIndex: 'teamNo',
    sorter: (a: any, b: any) => a.team_number?.localeCompare(b.team_number),
  },
]

export const assetCols = [
  {
    title: 'PID',
    key: 'pid',
    dataIndex: 'pid',
  },
  {
    title: 'IMEI',
    key: 'imei',
    dataIndex: 'imei',
  },
]
