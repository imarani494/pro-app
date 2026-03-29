import {ItinerarySuggestionsParams} from '../../../../journey/create/redux/customTripSlice';
import {RequestManager} from '../../../../utils/RequestManager';
const url = '/api/package/itinerary-suggestion';

export async function ItinerarySuggestionsApi(
  request: ItinerarySuggestionsParams,
) {
  try {
    const data = await RequestManager.getFormData(request);
    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(url, data, headers);
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
