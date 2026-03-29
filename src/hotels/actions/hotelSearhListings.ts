'use server';

import {AppConfig} from '../../config';
import {HttpRequest} from '../../utils';

export interface HotelSearchListingResponse {
  success: boolean;
  response_ref: string;
  _data: HotelSearchListing;
}

export interface HotelSearchListing {
  srchO: SrchO;
  prdExpFltrs: [];
  rsltA: RsltA[];
  fltrs: Fltrs;
  appFltrs: IappFltrs[];
}

export interface Fltrs {
  amenities: Amenities;
  nrlocg: Amenities;
  starrate: Amenities;
  proptype: Amenities;
  hotelid: Amenities;
  landmark: Amenities;
  fltrA: string[];
  mealplan: Amenities;
}

export interface Amenities {
  shw: boolean;
  opts: Opt[];
  typ: string;
  nm: string;
  fld: string;
  iSngl?: boolean;
}

export interface Opt {
  val: string;
  cnt: number;
  nm: string;
}

export interface HotelTag {
  acls: string;
  nm: string;
}

export interface RsltA {
  area?: string;
  st: number;
  loc: string;
  ln: number;
  img: string;
  pr: number;
  prD: string;
  lt: number;
  prid: string;
  mpN: string;
  urtO?: UrtO;
  url: string;
  prQ: string;
  rnm: string;
  iPfd?: boolean;
  id: number;
  cntrctPrc: boolean;
  prdOff: boolean;
  nm: string;
  xpDtlA?: string[];
  xpSmry?: string;
  isNR?: boolean;
  ctag: HotelTag[];
  cmsD?: string;
}

export interface UrtO {
  rt: number;
  rtTxt: string;
  numRt: number;
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

export interface IappFltrs {
  d: string;
  v: string;
  fn: string;
  ft: string;
  fd: string;
}
// Use environment variable for the API domain
const HOTEL_API_DOMAIN = `${AppConfig.host}/api`;
if (!HOTEL_API_DOMAIN) {
  throw new Error(
    'NEXT_PUBLIC_HOTEL_API_DOMAIN is not set in environment variables',
  );
}
const HOTEL_API_URL = `${HOTEL_API_DOMAIN}/hotels/search-x?application=com.tf.yourholiday&__xreq__=false`;

export async function fetchHotelDetails({
  postData,
}: {
  postData: string;
}): Promise<HotelSearchListingResponse | {error: string}> {
  try {
    // Parse the URL-encoded string into an object
    const requestParams: any = {};
    const pairs = postData.split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key && value !== undefined) {
        requestParams[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    }

    const response = await HttpRequest.post(HOTEL_API_URL, requestParams);
    return response;
  } catch (err) {
    return {error: err instanceof Error ? err.message : String(err)};
  }
}
