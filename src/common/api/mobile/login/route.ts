import {RequestManager} from '../../../../utils/RequestManager';
const url = '/api/mobile/login';
// Types
export interface LoginParams {
  email: string;
  password: string;
}
export async function loginApi(data: LoginParams) {
  try {
    const formData = await RequestManager.getFormData(data);
    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(url, formData, headers);
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
