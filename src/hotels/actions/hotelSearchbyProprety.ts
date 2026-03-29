'use server';

import {AppConfig} from '../../config';
import {HttpRequest} from '../../utils';

const HOTEL_API_DOMAIN = `${AppConfig.host}/api`;
if (!HOTEL_API_DOMAIN) {
  throw new Error(
    'NEXT_PUBLIC_HOTEL_API_DOMAIN is not set in environment variables',
  );
}

export interface IHotelSearchbyPropretyResponse {
  data: IHotelSearchbyProprety;
  id: number;
  value: string;
  nm: string;
}

export interface IHotelSearchbyProprety {
  st: number;
  id: number;
  url: string;
  nm: string;
}

export async function fetchHotelSuggest({
  cityId,
  queryText,
}: {
  cityId: number;
  queryText: string;
}): Promise<IHotelSearchbyPropretyResponse | {error: string}> {
  const url = `${HOTEL_API_DOMAIN}/gen/msc/hotel-suggest`;
  const params = {
    q: queryText,
    __xreq__: true,
    city: cityId,
    iSltrMd: true,
    iSlFw: true,
    application: 'com.tf.yourholiday',
  };

  try {
    const response = await HttpRequest.get(url, params);
    return response;
  } catch (err) {
    return {error: err instanceof Error ? err.message : String(err)};
  }
}
