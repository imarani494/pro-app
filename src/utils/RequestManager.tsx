import HttpRequest from './HttpRequest';
import AppConfig from '../config/AppConfig';

export class RequestManager {
  /**
   * Get request headers with auth token
   */
  static async getRequestHeaders(
    additionalHeaders?: Record<string, string>,
  ): Promise<Record<string, string>> {
    const authToken = await AppConfig.authToken();
    return {
      ...(authToken && {Authorization: `Bearer ${authToken}`}),
      'Content-Type': 'application/x-www-form-urlencoded',
      ...additionalHeaders,
    };
  }

  /**
   * Extract form data from object (for mobile, we receive data as object)
   */
  static async getFormData(data: {
    [key: string]: any;
  }): Promise<{[key: string]: any}> {
    // In mobile app, data is already an object, not FormData
    return data;
  }

  /**
   * Extract JSON data (for mobile, we receive data as object)
   */
  static async getJsonData(data: any): Promise<any> {
    return data;
  }

  /**
   * Create a standardized JSON response
   */
  static createJsonResponse(
    data: any,
    options?: {
      status?: number;
      headers?: Record<string, string>;
      cache?: boolean;
    },
  ): any {
    // In mobile app, we just return the data directly
    // The status and headers are handled by HttpRequest
    return data;
  }

  /**
   * Create an error response
   */
  static createErrorResponse(error: string | Error, status: number = 500): any {
    const message = error instanceof Error ? error.message : error;
    return {
      success: false,
      error: message,
      status,
    };
  }

  /**
   * Make a POST request using HttpRequest
   */
  static async post(
    url: string,
    data: {[key: string]: any},
    headers?: Record<string, string>,
  ): Promise<any> {
    try {
      const requestHeaders = await this.getRequestHeaders(headers);
      // HttpRequest.post handles the data transformation internally
      return await HttpRequest.post(url, data);
    } catch (error: any) {
      return this.createErrorResponse(error);
    }
  }

  /**
   * Make a GET request using HttpRequest
   */
  static async get(
    url: string,
    params: {[key: string]: any},
    headers?: Record<string, string>,
  ): Promise<any> {
    try {
      const requestHeaders = await this.getRequestHeaders(headers);
      return await HttpRequest.get(url, params);
    } catch (error: any) {
      return this.createErrorResponse(error);
    }
  }
}
