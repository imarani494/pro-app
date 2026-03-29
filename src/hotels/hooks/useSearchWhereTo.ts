import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { fetchHotelDestSuggest, type IHotelDestSuggestResponse } from 'hotels/actions/wherewToSearchHotels';

export function useSearchWhereTo({ q } : { q: string; }): UseQueryResult<IHotelDestSuggestResponse[] | { error: string }, Error> {
  return useQuery<IHotelDestSuggestResponse[] | { error: string }>({
    queryKey: ['hotel-where-to-suggest', q],
    queryFn: () => fetchHotelDestSuggest({ q }),
    enabled: !!q,
    staleTime: 60_000,
  });
}