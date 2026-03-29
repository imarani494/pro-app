import {HotelSuggestParams} from '../../../../../journey/create/redux/customTripSlice';
import {RequestManager} from '../../../../../utils';
const url = '/api/gen/msc/hotel-dest-suggest';

export async function hotelDestSuggestApi(request: HotelSuggestParams) {
  try {
    const data = await RequestManager.getFormData(request);
    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(url, data, headers);
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
