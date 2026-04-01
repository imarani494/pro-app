export type CarPickupSearchDataResponse = FlightListData[]

export interface FlightListData {
  data: Data
  value: string
  _scr: number
}

export interface Data {
  id: number
  pnm?: string
  nm: string
  isApt?: boolean
}