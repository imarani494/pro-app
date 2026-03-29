import {RequestManager} from '../../../../../utils';
const url = '/api/gen/msc/city-suggest';

export async function citySuggestApi(request: any) {
  try {
    const data = await RequestManager.getFormData(request);
    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(url, data, headers);
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
