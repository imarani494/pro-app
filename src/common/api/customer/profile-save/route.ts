import {ProfileSaveParams} from '../../../../journey/create/redux/customTripSlice';
import {RequestManager} from '../../../../utils/RequestManager';
const url = '/api/customer/profile-save';

export async function profileSaveApi(request: ProfileSaveParams) {
  try {
    const data = await RequestManager.getFormData(request);
    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(url, data, headers);
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
