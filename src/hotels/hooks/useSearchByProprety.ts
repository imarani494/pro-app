import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchHotelSuggest , type IHotelSearchbyPropretyResponse} from 'hotels/actions/hotelSearchbyProprety';

export function useSearchByProprety(cityId: number, queryText: string):
UseQueryResult<IHotelSearchbyPropretyResponse | {
    error: string;
}, Error> {
  const query = useQuery<IHotelSearchbyPropretyResponse | { error: string }>({
    queryKey: ['hotel-suggest', cityId, queryText],
    queryFn: () => fetchHotelSuggest({ cityId, queryText }),
    enabled: !!queryText,
    staleTime: 60_000,
  });
  return query;
}
