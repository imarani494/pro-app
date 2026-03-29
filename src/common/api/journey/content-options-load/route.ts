import {RequestManager} from '../../../../utils/RequestManager';
const url = '/api/journey/content-options-load';

export async function contentOptionsLoadApi(request: any) {
  try {
    const data = await RequestManager.getFormData(request);

    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(url, data, headers);

    const response = RequestManager.createJsonResponse(rep);

    return response;
  } catch (error: any) {
    console.error('💥 contentOptionsLoadApi error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return RequestManager.createErrorResponse(error);
  }
}
