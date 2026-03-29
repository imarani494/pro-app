import {RequestManager} from '../../../../utils/RequestManager';

// Types
export interface SaveDeviceInfoParams {
  [key: string]: any;
}

/**
 * POST handler for /api/mobile/save-device-info
 * Similar to web app's route.ts POST function
 */
export async function saveDeviceInfoApi(data: SaveDeviceInfoParams) {
  try {
    const formData = await RequestManager.getFormData(data);
    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(
      '/api/mobile/save-device-info',
      formData,
      headers,
    );
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
