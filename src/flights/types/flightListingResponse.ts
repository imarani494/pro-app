export interface FlightListDataResponse {
  search: Search;
  flights: Record<string, FlightListData[]>;
}

export interface FlightListData {
  cur: string;
  dur: number;
  prc: number;
  scr: number;
  legs: FlightListData_Leg[];
  stl?: number;
  frnm?: string;
  srl: string;
  key: string;
  spl: boolean;
  isOHF: boolean;
  zrf: boolean;
  airlineLogo: string;
  fltNumA: string[];
  arlNms: string[];
  depAirport: string;
  depCode: string;
  arrCode: string;
  arrAirport: string;
  bggA: string[];
  stops: number;
  depTime: string;
  arrTime: string;
  depT: string;
  arrT: string;
  layDurStr: string;
  nextFlight: null;
  comboMap: null;
}

export interface FlightListData_Leg {
  arr: Date;
  dur: number;
  bgg: string;
  upg: boolean;
  stp: number;
  dep: Date;
  cbn: string;
  flt: string;
  zrf: boolean;
  car: string;
  fromT: string;
  toT: string;
  from: string;
  to: string;
  crn: string;
  eqp?: string;
  mR?: MR;
  opc?: string;
}

export interface MR {
  rules: Rules;
}

export interface Rules {
  cancel: Cancel[];
  change: Cancel[];
  text: string[];
}

export interface Cancel {
  chg: number;
  dpr: string;
  hrs: number;
}

export interface Search {
  nAdt: number;
  nInf: number;
  nChd: number;
  isStpAl: boolean;
  legs: SearchLeg[];
  cabin: string;
  isRet: string;
  sTyp: string;
}

export interface SearchLeg {
  sArNm: string;
  dst: string;
  dArNm: string;
  src: string;
  dCyNm: string;
  sCyNm: string;
  dep: string;
}

export interface FlightSearchParams {
  chkInDt: null;
  chkOutDt: null;
  pkgId: string;
  srchQ: string;
  incPrc: boolean;
  fphFlow: boolean;
  prdFlow: null;
  prFlt: boolean;
  __xreq__: boolean;
  application: string;
}
