import {AgentSuggestParams} from '../../../../../journey/create/redux/customTripSlice';
import {RequestManager} from '../../../../../utils';
const url = '/api/gen/msc/otb-suggest';

export async function otbSuggestApi(request: AgentSuggestParams) {
  try {
    const data = await RequestManager.getFormData(request);
    const headers = await RequestManager.getRequestHeaders();

    const rep = await RequestManager.post(
      `${url}?_auth=${data._auth}&application=${data.application}`,
      data,
      headers,
    );
    return RequestManager.createJsonResponse(rep);
  } catch (error: any) {
    return RequestManager.createErrorResponse(error);
  }
}
