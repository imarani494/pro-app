import {RequestManager} from '../../../../../utils';

const url = '/api/activity/detail';

export async function contentOptionDetailsApi(params: any) {
  try {
    const data = await RequestManager.getFormData(params);
    const headers = await RequestManager.getRequestHeaders();

    // Only add edit parameter to URL if it's provided and not undefined
    const editParam = params?.edit ? params.edit : '';

    const rep = await RequestManager.post(
      `${url}/${params?.id}`,
      data,
      headers,
    );
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
