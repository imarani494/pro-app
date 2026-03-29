import {RequestManager} from '../../../../utils/RequestManager';
const url = '/api/car/quote-details-save';

export async function saveCarQuoteDetailsApi(request: any) {
  try {
    const data = await RequestManager.getFormData(request);
    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(url, data, headers);
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
