import { Feature, FeatureCollection } from './GeoJson'
import { SettlementTypes } from '@erase/common/types'
import { Settlements } from '@erase/common/entity'
import { Moment } from 'moment'

export type stateProp<T> = {
  value: T
  setter: (val: T) => void
}

export interface StateContextProps {
  children: React.ReactNode
}

export const enum ROLES {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  SUPPORT = 'support',
  ASSISTANT = 'assistant',
}

export const enum USER_TYPES {
  DASHBOARD = 'dashboard',
  MOBILE = 'mobile',
}
export const enum PHONE_NETWORKS {
  JAZZ = 'Jazz',
  SCOM = 'SCOM',
  TELENOR = 'Telenor',
  UFONE = 'Ufone',
  WARID = 'Warid',
  ZONG = 'Zong',
}

export type role = ROLES.SUPER_ADMIN | ROLES.ADMIN | ROLES.SUPPORT | ROLES.ASSISTANT

export interface UserDetail {
  id: number
  userName: string
  role: role
}

export type infowWindowLatLong = {
  lat: number
  lng: number
}

/* Timeline Typings */
export type CampaignDayType = 'CatchUpDays' | 'CampaignDays'

export type TimelineDay = {
  timestamp: number
  date: Date
  day: number
}

export type TimelineDays = {
  [key: number]: number
}

export type Timeline = {
  [key in CampaignDayType]: TimelineDays
}

export const TimelineInit: Timeline = { CampaignDays: [], CatchUpDays: [] }

export type DateToDay = {
  [key: string]: number
}

export type DayToDate = {
  [key: number]: string
}

/* Map Typings */
export type Point = {
  lat: number
  lng: number
}

export interface BoundaryObject {
  geojson: Feature
  pointGeom: Point[]
  details: {
    type: BoundariesTypes
    name: string
    id: string
  }
}

export type BoundariesTypes =
  | '38eb4157-c0e8-4334-ad79-9801610c4ab8'
  | '93313048-4e75-4e91-9bcd-44897a6df7c7'
  | 'acf0cc70-7c92-474d-82af-f37494f94c09'

export type Boundaries = {
  [key in BoundariesTypes]: BoundaryObject[]
}

export type Grids = {
  [Key: string]: FeatureCollection | undefined
}

export type SettlementAreas = {
  [Key in SettlementTypes]: Settlements[] | undefined
}

export type SettlementType = 'BUA' | 'HA' | 'SSA' | 'POI'

export type MarkerType = {
  coordinates: Point
  name: string
  id: string
  ucId: string
}

/* Track Typings */
export type AIC = {
  IMEI: string
  name: string
}

export type Team = {
  key: string
  IMEI: string
  value: string
  AICName: string
  AICId: string
}

export type PingDetail = {
  coordinate: Point
  time: number
  imei?: string
}

export type Pings = {
  Pings: PingDetail[]
  date: string
  title: string
  trackType: string
  distance?: number
}

export type TrackStatus = 'valid' | 'invalid'

export type Tracks = {
  [key in TrackStatus]: Pings[]
}

export type TrackDays = {
  [key: number]: Tracks
}

export type hierarchyEntity = {
  value: string
  areaId: string
}

export type TeamInfo = {
  Type: string
  Name: string
  Date: string
}

export const TeamInfoInit = {
  Type: '',
  Name: '',
  Date: '',
}

export type PlaybackSpeed = 1 | 2 | 4 | 8 | 16 | 32

export type PlayerState = 'INIT' | 'PAUSED' | 'PALYING' | 'COMPLETED'

export type RangeValue = null | [Moment | null, Moment | null]
