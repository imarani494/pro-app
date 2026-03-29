export interface IhotelListingParams {
  cityId: string;
  checkinDate: string;
  checkoutDate: string;
  nationality: string;
  roomspax?: string;
  prHtl?: boolean;
  __xreq__?: boolean;
  isConciseLoad?: boolean;
  hotelSlug?: string;
  _auth?: string;
  userId?: string;
  tvlrKeys?: string;
  jid?: string;
  bid?: string;
}

export interface IHotelDetailsResponse {
  success: boolean;
  response_ref: string;
  _data: IHotelDetailsData;
}

export interface IHotelDetailsData {
  shwPrcDiff: boolean;
  hId: number;
  srchO: SrchO;
  iBfstPf: boolean;
  rmA: RmA[];
  rmPaxTxt: string[];
  details: IStaticDetails;
  rmCfg: RmCfg;
  isShwCms?: boolean;
  iSltdRmNotAvl: boolean;
  rmErrMsg: string;
}

type RmCfg = {
  isMultiRmType: boolean;
  rmPaxTxt: string[];
  nRMap: [Record<string, string[]>];
};

export interface RmA {
  roptA: RoptA[];
  nm: string;
  amA?: string[];
  dsc?: string;
  id?: number;
  szD?: string;
  bedD?: string;
  imgA?: string[];
  vwN?: string;
}

export interface RoptA {
  cur: string;
  pr: number;
  prD: string;
  mp: string;
  mlD: string;
  prId: string;
  mpN: string;
  xpDtlA: string[];
  prQ: string;
  xpSmry: string;
  absPrc: number;
  uId: string;
  avlRooms: number;
  rtcd: string;
  name: string;
  key: string[];
  isNR?: boolean;
  splTxtA?: string[];
  cmsD?: string;
  iSltd?: number[];
}

export interface SrchO {
  cnm: string;
  chkOut: string;
  chkIn: string;
  paxD: string;
  ntn: number;
  nts: number;
  paxes: Paxes;
  cid: string;
  ntnD: string;
}

export interface Paxes {
  rooms: Room[];
}

export interface Room {
  ad: number;
  ch: number;
  chAge: number[];
}
export interface IStaticDetails {
  rooms: Room[];
  amentities: string[];
  hotelAddress: string;
  hotelDesc: string;
  knowBeforeYouGo: string;
  hotelName: string;
  hotelLocation: HotelLocation;
  hotelCity: string;
  highlights: string[];
  hotelImages: HotelImage[];
  specialInstructions: string;
  optionalFees: string;
  starRating: number;
  guestRating: GuestRating;
  policy: Policy;
}

export interface GuestRating {
  rpO: RpO;
  or: number;
  prd: number;
  t: number;
}

export interface RpO {
  LOCATION: number;
  COMFORT: number;
  AMENITIES: number;
  SERVICE: number;
  CONDITION: number;
  NEIGHBORHOOD: number;
  VALUE: number;
  CLEANILESS: number;
}

export interface HotelImage {
  imageUrl: string;
  caption?: string;
}

export interface HotelLocation {
  ln: number;
  lt: number;
}

export interface Policy {
  checkIn: string;
  checkout: string;
}

export interface Room {
  image: string;
  name: string;
  viewType?: string;
  description: string;
  roomArea?: number;
}
