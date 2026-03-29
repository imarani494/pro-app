import {HttpRequest} from '../../../../utils';
const url = '/api/user/reset-password';

export async function resetPassword(params: any) {
  try {
    const response = await HttpRequest.post(url, params);
    console.log('Success:', response);
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
