import {RequestManager} from '../../../../../utils';

const url = '/api/journey/history';

export async function journeyHistoryApi(request: any) {
  try {
    const {id} = await request;
    const data = await RequestManager.getFormData(request);
    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(`${url}/${id}`, data, headers);
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
