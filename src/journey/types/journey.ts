// import { ContentCardType } from "@/contentCard/types/contentCard";

export enum ContentCardType {
  SIGHTSEEING = 'SIGHTSEEING',
  TRANSFERS = 'TRANSFERS',
  MEAL_COUPONS = 'MEAL_COUPONS',
  VISA = 'VISA',
  TRAVEL_INSURANCE = 'TRAVEL_INSURANCE',
  TRAVEL_PASS = 'TRAVEL_PASS',
  HOTEL_ROOM = 'HOTEL_ROOM',
  TRAIN = 'TRAIN',
  FLIGHT = 'FLIGHT',
  STAY_EXTRA_SERVICE = 'STAY_EXTRA_SERVICE',
  HOTEL_EXTRAS = 'HOTEL_EXTRAS',
  ROAD_VEHICLE = 'ROAD_VEHICLE',
  ATTRACTION_TICKET = 'ATTRACTION_TICKET',
  CAR_RENTAL = 'CAR_RENTAL',
  INSURANCE='INSURANCE',
  FIXED_PACKAGE='FIXED_PACKAGE',
  JOURNEY_CRUISE='JOURNEY_CRUISE',
 

}

export enum ContentCardQueryType {
  LISTINGS = 'LISTINGS',
  DETAIL = 'DETAIL',
  OPTION_DETAIL = 'OPTION_DETAIL',
  GROUP_LISTINGS = 'GROUP_LISTINGS',

}

export interface IJourney {
  img: string;
  rooms: number;
  ntnNm: string;
  tvlDt: string;
  infants: number;
  pxO: PxO;
  ntnId: number;
  adults: number;
  jnm: string;
  jid: string;
  jpId: string;
  paxD: string;
  nts: number;
  trvlrA: TrvlrA[];
  dyA: DyA[];
  exCtyId: number;
  exCtyNm: string;
  children: number;
  ctyA: CtyA[];
  prcO: PrcO;
  agentQuoteLink: string;
  dys: number;
  insurance: any;
  visa: Visa[];
  id: string;
  qTagA?: string[]; 
  gBlkA?: GBlkA[]; 
}

export interface CtyA {
  cky: string;
  nt: number;
  cid: string;
  nm: string;
  cnm: string;
}

export interface Meal {
  name: string;
  type: string;
  itemA: {
    isInc: boolean;
    text: string;
    tvlG: {
      tvlA: string[];
    };
    srcBlockId?: string;
    isAtHotel?: boolean;
    actions?: {
      addPrms: {
        mealType: string;
      };
      ctype: string;
      name: string;
      type: string;
      tvlG: {
        tvlA: string[];
      };
    }[];
  }[];
}

export interface DyA {
  dayType?: string;
  date: string;
  cky: string;
  dCtyD: string;
  img: string;
  landDayNum: number;
  dayNum: number;
  dCty: string;
  ttl: string;
  cityLandDayNum: number;
  blkA?: BlkA[];
  actions?: Action[];
  meals: Meal[];
  uTxptO?: any;
  // dCty: string;
  dayNumD?: number;
  sCty?: any;
}

interface OtherData {
  city: string;
  srchO: any;
  opts?: any;
}
export interface Action {
  qt?: ContentCardQueryType;
  addPrms?: {
    dcty?: string;
    actions?: Array<{type: string; name: string}>;
    [key: string]: any;
  };
  ctype: ContentCardType;
  name: string;
  tvlG: {
    tvlA: Array<string>;
  };
  type: string;
  rstTvlG: {
    tvlA: Array<string>;
  };
  rmTvlG: string[][];
  otherData: OtherData;
  updReq?: any;
}

// Advisory (advisor) comment attached to a block
export interface AdvisoryComment {
  commentId: string;
  comment: string;
  userName: string;
  userId?: number;
  actions?: Action[]; // actions specific to this comment (e.g. edit/delete metadata)
  createdAt?: string; // optional timestamp if backend provides
  updatedAt?: string; // optional timestamp if backend provides
}

export interface BlkA {
  slotD?: string;
  img?: string;
  carO?: any;
  inTA?: string[];
  grpNm?: string;
  typ: string;
  tmD?: string;
  slot?: Slot;
  tvlG: TvlG;
  ttl?: string;
  advCmtA?: AdvisoryComment[];
  cdnm?: string;
  url?: string;
  typD: string;
  exTA?: string[];
  cky?: string;
  cdid?: number;
  txpN?: string;
  dsc?: string;
  subType?: string;
  drH?: number;
  bid: string;
  txpT?: string;
  fltO?: FltO;
  dCtyId?: number;
  arrTm?: Date;
  fGrpId?: string;
  depTm?: Date;
  aCtyId?: number;
  isInb?: boolean;
  loc?: string;
  hid?: number;
  ln?: number;
  mlD?: string;
  srchQ?: SrchQ;
  nt: number;
  lt?: number;
  coutT?: string;
  urtO: UrtO;
  isNR?: boolean;
  area?: string;
  st?: number;
  cinT?: string;
  hnm: string;
  rmA?: RmA[];
  chkin?: string;
  prid?: string;
  dcty?: string;
  xpDtlA?: string[];
  xpSmry?: string;
  dctyD?: string;
  chkout?: string;
  ntA?: string[];
  isOub?: boolean;
  actions?: Action[];
  fSrchO: any;
  txpL: TxpL;
  pkCty?: string;
  dpCty?: string;
  dpDt?: string;
  pkDt?: string;
  txptName?: string;
  vldA?: any[];
  addOnA?: any[];
  acA?: Array<{
    p?: number;
    pr?: number;
    t?: string;
    oc?: string;
    flK?: string;
    si?: number;
    tvlG?: TvlG;
    fs?: string;
    on?: string;
    cr?: string;
  }>;
  dCtyA?: string[];
  rts_info?: string;
  fSctNm?: string;
  pkgName?: string;
  itnDsp?: string;
  hgh?: string[];
  pkgDstSmry?: {
    cts?: number;
    cntry?: number;
    dys?: number;
  };
  nm?: string;
  mFeTxt?: string;
  hlA: string[];
  rmTvlsG?: string[][] | undefined;
  rchDA: string[];
  bggN?: string;
  txptA?: Array<{
    txt: string;
  }>;
  txptN?: string;
  paxD?: string;
  ustyD?: {
    t?: string;
    hnm?: string;
    adr?: string;
  };
  uTxptO?: any;
  dayNum?: number;
  dCtyD?: string;
  // Self-booked tour fields
  isSelfBookedTour?: boolean;
  title?: string; // For self-booked tours
  description?: string; // For self-booked tours
  cityKey?: string; // For self-booked tours (in addition to cky)
  exitCityId?: number; // For self-booked tours
  [key: string]: any;
}

export interface GBlkA {
  dploc: string;
  scr: string;
  bid: string;
  paxD: string;
  typ: string;
  tvlG: TvlG;
  typD: string;
  sid: number;
  uid: number;
  invBKupA: InvBkupItem[];
  unm: string;
  pkloc: string;
  idx: number;
  actions?: Action[];
  nm: string;
  dsc?: string;
  jid?: string;
  cdid?: number;
}

export interface InvBkupItem {
  cur: string;
  cost: number;
  costInUSD: number;
  sell: number;
  sellInUSD: number;
  spNm: string;
  mkupShId: number;
  details: string;
  lnkA?: Array<{v: string; k: string}>;
}

interface TxpL {
  st: string;
  nm: string;
}
export interface FltO {
  dur: number;
  scr: number;
  legs: Leg[];
  key: string;
  spl: boolean;
  isOHF: boolean;
  zrf: boolean;
  frnm: string;
}

export interface Leg {
  arr: string;
  dur: number;
  bgg: string;
  upg: boolean;
  stp: number;
  dep: string;
  cbn: string;
  flt: string;
  zrf: boolean;
  car: string;
  fromT: string;
  toT: string;
  from: string;
  to: string;
  crn: string;
  fromA: string; // from airport name
  toA: string; // to airport name
  toC: string; // to city
  fromC: string; // from city
  mls: string; // meals info
}

export interface RmA {
  rmN: string;
  qty: number;
  inc: string[];
}

export interface Slot {
  s: number;
  e: number;
}

export interface SrchQ {
  chkOut: string;
  chkIn: string;
  ntn: number;
  nts: number;
  paxes: PxO;
  cid: string;
}

export interface PxO {
  rooms: Room[];
}

export interface Room {
  ad: number;
  ch: number;
  chAge: any[];
}

export interface TvlG {
  tvlA: string[];
}

export interface UrtO {
  rt: number;
  rtTxt: string;
  numRt: number;
}

export interface PrcO {
  prcBkA: PrcBkA[];
  ttlD: string;
}

export interface PrcBkA {
  v: string;
  k: string;
}

export interface TrvlrA {
  tD: string;
  snm: string;
  t: string;
  id: string;
  nm: string;
}

export interface TravelerGroup {
  tvlA: string[];
}
export interface VisaAction {
  ctype: string;
  name: string;
  tvlG: TravelerGroup;
  type: string;
}

export interface VisaItem {
  isInc: boolean;
  text: string;
  tvlG: TravelerGroup;
  actions: VisaAction[];
  srcBlockId?: string;
}

export interface Visa {
  itemA: VisaItem[];
  destId: number;
  name: string;
  rstTvlG: TravelerGroup;
}
