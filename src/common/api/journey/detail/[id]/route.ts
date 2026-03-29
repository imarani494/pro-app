import {RequestManager} from '../../../../../utils';

const url = '/api/journey/detail';

export async function journeydetailApi(params: any) {
  console.log('journeydetailApi called with request:', params);

  try {
    const data = await RequestManager.getFormData(params);
    const headers = await RequestManager.getRequestHeaders();

    // Only add edit parameter to URL if it's provided and not undefined
    const editParam = params?.edit ? params.edit : '&edit=true';

    // Build query parameters
    const queryParams: string[] = [];
    if (params?.jdid) {
      queryParams.push(`jdid=${encodeURIComponent(params.jdid)}`);
    }
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    const rep = await RequestManager.post(
      `${url}/${params?.id}${queryString}${editParam}`,
      data,
      headers,
    );
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
