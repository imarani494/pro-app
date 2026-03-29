import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { fetchLocationSuggest, type ILocationSuggestResponse } from 'hotels/actions/locationSuggest';

export function useSearchByLocation({ q } : { q: string; }): UseQueryResult<ILocationSuggestResponse[] | {
    error: string;
}, Error> {
  const query = useQuery<ILocationSuggestResponse[] | { error: string }>({
    queryKey: ['location-suggest', q],
    queryFn: () => fetchLocationSuggest({ q }),
    staleTime: 60_000,
    enabled:!!q
  });
  return query;
} 