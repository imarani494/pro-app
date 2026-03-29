import { useQuery, type UseQueryResult, useMutation } from '@tanstack/react-query';

import { fetchHotelDetails, type HotelSearchListingResponse } from 'hotels/actions/hotelSearhListings';

export function useHotelSearchListings(postData: string): UseQueryResult<HotelSearchListingResponse | { error: string }, Error> {
  return useQuery({
    queryKey: ['hotel-search-listings', postData],
    queryFn: () => fetchHotelDetails({ postData }),
    enabled: !!postData,
    staleTime: 60_000,
  });
}

export function useHotelSearchListingsMutation(): ReturnType<typeof useMutation<HotelSearchListingResponse | { error: string }, Error, string>> {
  return useMutation<HotelSearchListingResponse | { error: string }, Error, string>({
    mutationFn: (postData: string) => fetchHotelDetails({ postData }),
  });
} 