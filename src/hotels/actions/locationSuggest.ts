'use server';

import {AppConfig} from '../../config';
import {HttpRequest} from '../../utils';

// import { cityId, ptyp, token } from "hotels/consts";

// Use environment variable for the API domain
const HOTEL_API_DOMAIN = `${AppConfig.host}/api`;
if (!HOTEL_API_DOMAIN) {
  //throw new Error("NEXT_PUBLIC_HOTEL_API_DOMAIN is not set in environment variables");
}

export interface ILocationSuggestResponse {
  data: ILocationSuggest;
  id: string;
  value: string;
}

export interface ILocationSuggest {
  id: string;
  adr: string;
  nm: string;
}

export async function fetchLocationSuggest({
  q,
  token,
  ptyp,
  cid,
}: {
  q: string;
  token: any;
  ptyp: any;
  cid: any;
}): Promise<ILocationSuggestResponse[] | {error: string}> {
  const url = `${HOTEL_API_DOMAIN}/gen/msc/paddr-suggest`;
  const params = {
    q: q,
    __xreq__: true,
    token: token,
    ptyp: ptyp,
    cid: cid,
    application: 'com.tf.yourholiday',
  };

  try {
    const response = await HttpRequest.get(url, params);
    return response;
  } catch (err) {
    return {error: err instanceof Error ? err.message : String(err)};
  }
}
