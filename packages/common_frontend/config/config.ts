import axios from 'axios'

import { HMAIcon, LMAIcon, MMAIcon } from '@erase/common_frontend/assets'
import { message } from 'antd'

const INTRA_URL = process.env.REACT_APP_INTRA_URL as string
const BART_URL = process.env.REACT_APP_BART_URL as string
const HOMER_URL = process.env.REACT_APP_HOMER_URL as string
const USERS_URL = process.env.REACT_APP_USERS_URL as string
const MR_BURNS_URL = process.env.REACT_APP_MR_BURNS_URL as string

export const IntraInstance = axios.create({
  baseURL: INTRA_URL,
  timeout: 100000,
  withCredentials: true,
})

const commonInterceptor = async (error, instance) => {
  if (!error.response) return
  if (error.response.status === 401 && error.response.data.toString().toLowerCase().includes('deactivated')) {
    message.error('Deactivated user')
    throw error
  }

  const originalRequest = error.config

  // Check if the error response indicates an expired token
  if (error.response.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true

    // Get the refresh token from storage
    const refreshToken = localStorage.getItem('refreshToken')

    // Make a request to refresh the access token
    const response = await UserServiceInstance.post('/refreshToken', { token: refreshToken })
    if (!response?.data?.accessToken) return

    // Update the access and refresh tokens in storage
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)

    // Set the new access token in the authorization header
    instance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

    // Retry the original request with the new access token
    return instance(originalRequest)
  }

  return Promise.reject(error)
}

// Apply common interceptor to all instances
const applyCommonInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => commonInterceptor(error, instance)
  )
}

// Create instances
export const BartInstance = axios.create({
  baseURL: BART_URL,
  timeout: 1000000,
  withCredentials: true,
  headers: {
    common: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  },
})

applyCommonInterceptor(BartInstance)

export const HomerInstance = axios.create({
  baseURL: HOMER_URL,
  timeout: 1000000,
  headers: {
    common: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  },
})

applyCommonInterceptor(HomerInstance)

export const UserServiceInstance = axios.create({
  baseURL: USERS_URL,
  timeout: 100000,
  headers: {
    common: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  },
})

applyCommonInterceptor(UserServiceInstance)
// interceptor for handling token refresh

export const MrBurnsInstance = axios.create({
  baseURL: MR_BURNS_URL,
  headers: {
    common: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  },
})

applyCommonInterceptor(MrBurnsInstance)

type Libraries = ('drawing' | 'geometry' | 'localContext' | 'places' | 'visualization')[]

const MAP_LIBRARIES: Libraries = ['drawing']

export const mapConfig = {
  libraries: MAP_LIBRARIES,
  Center: {
    lat: 33.61434,
    lng: 73.028259,
  },
  Boundaries: {
    Province: {
      color: '#2CC256',
    },
    Distict: {
      color: '#A0D911',
    },
    Tehsil: {
      color: '#EB2F96',
    },
    Uc: {
      color: '#722ED1',
    },
    AIC: {
      color: '#FA8C16',
    },
    MiniMap: {
      fillColor: '#C4C4C4',
      strokeWeight: 0.5,
      strokeColor: 'white',
    },
  },
  Grids: {
    AONI: {
      fillColor: '#8C8C8C',
      fillOpacity: 0.6,
      strokeWeight: 0.5,
      strokeColor: 'transparent',
      clickable: false,
      zIndex: 1,
    },
    Covered: {
      fillColor: '#7ECE86',
      fillOpacity: 0.6,
      strokeColor: 'transparent',
      clickable: false,
      strokeWeight: 0.5,
      zIndex: 5,
    },
    NotServed: {
      fillColor: '#FFC069',
      fillOpacity: 0.6,
      strokeColor: 'transparent',
      clickable: false,
      strokeWeight: 0.5,
      zIndex: 4,
    },
    Population: {
      fillColor: '#7A89C2',
      fillOpacity: 0.6,
      // strokeColor: 'transparent',
      clickable: false,
      strokeWeight: 0.5,
      zIndex: 4,
    },
    Missed: {
      fillColor: '#FF7875',
      fillOpacity: 0.6,
      strokeColor: 'transparent',
      clickable: false,
      strokeWeight: 0.5,
      zIndex: 3,
    },
    SettlementAONI: {
      fillColor: 'violet',
      strokeWeight: 0.5,
      strokeColor: 'transparent',
      fillOpacity: 0.6,
      clickable: false,
      zIndex: 2,
    },
    MiniMap: {
      fillColor: '#C4C4C4',
      strokeWeight: 0.2,
      strokeColor: 'white',
      fillOpacity: 0.6,
      clickable: false,
      zIndex: 2,
    },
  },
  MarkedPolygons: {
    AONI: {
      fillColor: '#1890FF',
      fillOpacity: 0.6,
      strokeWeight: 0.5,
      strokeColor: 'transparent',
      clickable: false,
      zIndex: 1,
    },
    SUSPECTEDAONI: {
      fillColor: '#1890FF',
      strokeColor: 'transparent',
      strokeWeight: 0.5,
      fillOpacity: 0.6,
      clickable: false,
      zIndex: 2,
    },
  },
  Settlements: {
    BUA: {
      fillColor: 'transparent',
      strokeWeight: 2,
      strokeColor: '#36CFC9',
      clickable: true,
      zIndex: 10,
    },
    SSA: {
      fillColor: 'transparent',
      strokeWeight: 2,
      strokeColor: '#9254DE',
      clickable: true,
      zIndex: 10,
    },
    HA: {
      fillColor: 'transparent',
      strokeWeight: 2,
      strokeColor: '#F759AB',
      clickable: true,
      zIndex: 10,
    },
  },
  Bounds: {
    Province: {
      Default: { lat: 33.695765, lng: 73.021395 },
      Punjab: { lat: 31.1704, lng: 72.7097 },
      Sindh: { lat: 25.8943, lng: 68.5247 },
      Kpk: { lat: 34.9526, lng: 72.3311 },
      Balochistan: { lat: 28.4907, lng: 65.0958 },
    },
  },
  Pings: {
    FirstPing: '#FF0000',
    LastPing: '#FFFF00',
    Days: [
      {
        color: '#9254DE',
        dateColor: '#EFDBFF',
        images: 'As there is no Day Zero just for simplycity',
      },
      { color: '#9254DE', dateColor: '#EFDBFF', images: '/Tracks/Day1/m' },
      { color: '#F759AB', dateColor: '#FFD6E7', images: '/Tracks/Day2/m' },
      { color: '#FF4D4F', dateColor: '#FFCCC7', images: '/Tracks/Day3/m' },
      { color: '#FF7A45', dateColor: '#FFD8BF', images: '/Tracks/Day4/m' },
      { color: '#FFC53D', dateColor: '#FFF1B8', images: '/Tracks/Day5/m' },
      { color: '#BAE637', dateColor: '#F4FFB8', images: '/Tracks/Day6/m' },
      { color: '#36CFC9', dateColor: '#B5F5EC', images: '/Tracks/Day7/m' },
      { color: '#40A9FF', dateColor: '#BAE7FF', images: '/Tracks/Day8/m' },

      { color: '#FF7A45', dateColor: '#FFD8BF', images: '/Tracks/Day4/m' },
      { color: '#FFC53D', dateColor: '#FFF1B8', images: '/Tracks/Day5/m' },
      { color: '#BAE637', dateColor: '#F4FFB8', images: '/Tracks/Day6/m' },
      { color: '#36CFC9', dateColor: '#B5F5EC', images: '/Tracks/Day7/m' },
      { color: '#40A9FF', dateColor: '#BAE7FF', images: '/Tracks/Day8/m' },
    ],
    Colors: [
      '#043B5C',
      '#2D55FF',
      '#524EB7',
      '#E3BA8F',
      '#825E5C',
      '#F4EDE4',
      '#16453E',
      '#14CDC8',
      '#BAE4E5',
      '#B2DE27',
      '#93FAA5',
      '#68C3A3',
      '#6C7A89',
      '#BDC3C7',
      '#95A5A6',
    ],
  },
  KpkCentroids: {
    tehsils: {
      '12': { lat: 32.9546880299287, lng: 70.6570650192353 },
      '70': { lat: 32.9877352040165, lng: 70.8032832914907 },
      '24': { lat: 32.9479703928194, lng: 70.5401985815993 },
      '23': { lat: 32.9343471557967, lng: 70.4896912066839 },
      '36': { lat: 32.8663317496106, lng: 70.6770718410926 },
      '37': { lat: 32.9032762437037, lng: 70.5795511453691 },
    },
    districts: {
      '13': { lat: 32.9476809424216, lng: 70.6448627748972 },
    },
  },
}

export const getMaIcon = (confidence: string) => {
  switch (confidence) {
    case 'high':
      return HMAIcon
      break
    case 'medium':
      return MMAIcon
      break
    case 'low':
      return LMAIcon
      break

    default:
      return LMAIcon
  }
}
