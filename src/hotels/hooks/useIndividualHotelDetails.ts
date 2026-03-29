import { useMutation } from "@tanstack/react-query";
import {
  fetchIndividualHotelDetails,
  type IndividualHotelDetailsResponse,
} from "../actions/individualHotelDetails";

export function useIndividualHotelDetailsMutation() {
  return useMutation<IndividualHotelDetailsResponse, Error, string>({
    mutationFn: async (hotelSlug: string) => {
      return await fetchIndividualHotelDetails(hotelSlug);
    },
  });
}
