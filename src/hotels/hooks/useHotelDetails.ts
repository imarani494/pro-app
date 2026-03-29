import { useMutation } from '@tanstack/react-query';

import { fetchHotelDetails, type IHotelDetailsResponse } from '../actions/hotelDetails';

export interface HotelDetailsParams {
  hotelSlug: string;
  cityId: string | number;
  checkinDate: string;
  checkoutDate: string;
  nationality: string | number;
  roomspax: string;
  prHtl?: boolean | string;
  isConciseLoad?: boolean | string;
  __xreq__?: boolean | string;
}

export function useHotelDetailsMutation(): ReturnType<typeof useMutation<IHotelDetailsResponse | { error: string }, Error, HotelDetailsParams>> {
  return useMutation<IHotelDetailsResponse | { error: string }, Error, HotelDetailsParams>({
    mutationFn: async (params) => {
      return await fetchHotelDetails(params);
    },
  });
} 