import {fetch} from 'react-native-ssl-pinning';
import axios from 'axios';
const qs = require('qs');
import {UrlHandler} from '.';
import AppConfig from '../config/AppConfig';
import AppRemoteConfig from '../config/AppRemoteConfig';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
const defContentType = 'application/x-www-form-urlencoded';

class HttpRequest {
  static async get(url: string, params: any, contentType = defContentType) {
    const httpRequest = new HttpRequest();
    return httpRequest.request(url, params, 'GET', contentType);
  }

  static async post(url: string, params: any, contentType = defContentType) {
    const httpRequest = new HttpRequest();
    return httpRequest.request(url, params, 'POST', contentType);
  }

  async request(
    url: string,
    params: any,
    method: HttpMethod = 'GET',
    contentType = defContentType,
  ) {
    url = UrlHandler.checkUrl(url);
    params = await AppConfig.appConfigParams(params);

    if (AppConfig.logApiContract()) {
      console.debug('url:', url);
      console.debug('method:', method);
      console.debug('params:', JSON.stringify(params));
    }

    if (AppRemoteConfig.disableSSLPinning || AppConfig.isLocalhost()) {
      return this.requestWithoutSSLPinning(url, params, method, contentType);
    } else {
      return this.requestWithSSLPinning(url, params, method, contentType);
    }
  }

  private async requestWithSSLPinning(
    url: string,
    params: any,
    method: HttpMethod,
    contentType: string,
  ) {
    if (method === 'GET') {
      const queryString = qs.stringify(params, {
        arrayFormat: 'repeat',
        encode: true,
      });
      url = UrlHandler.checkParams(url, queryString);
    }

    let payload: any = {};
    if (method === 'POST') {
      payload = {
        data: qs.stringify(params, {arrayFormat: 'repeat', encode: true}),
      };
    }

    const certName = AppConfig.isDebugMode()
      ? ['krmtypeyourtrip']
      : ['yourholiday'];

    console.debug('Using SSL Pinning Certificate:', certName);
    console.debug('Request URL:', url);

    try {
      const response = await fetch(url, {
        method,
        timeoutInterval: 60000,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache no-store',
        },
        ...payload,
        sslPinning: {
          certs: certName,
        },
      });

      if (!response || !response.bodyString) {
        throw new Error('Invalid response or missing bodyString');
      }

      const data = JSON.parse(response.bodyString);

      if (AppConfig.logApiContract()) {
        console.debug('response:', JSON.stringify(data));
      }

      return data;
    } catch (error: any) {
      const errorMessage = error.message || error.toString();
      console.error('HttpRequest SSL Pinning Error:', errorMessage);
      console.error('Certificate used:', certName);
      console.error('URL:', url);

      // If certificate error, provide more helpful message
      if (
        errorMessage.includes('certificate') ||
        errorMessage.includes('invalid')
      ) {
        console.error(
          'SSL Pinning Error: Certificate may not be in app bundle or does not match server.',
          'Ensure certificates are added to "Copy Bundle Resources" in Xcode build phases.',
        );
      }

      return {success: false, error_msg: errorMessage || 'error!!'};
    }
  }

  private async requestWithoutSSLPinning(
    url: string,
    params: any,
    method: HttpMethod,
    contentType: string,
  ) {
    let payload: any = {params};

    if (method === 'GET') {
    } else if (method === 'POST') {
      payload = {data: qs.stringify(params, {arrayFormat: 'repeat'})};
    }

    console.debug('Using Axios without SSL Pinning');

    try {
      const {data} = await axios({
        url,
        method,
        headers: {
          'Content-Type': contentType,
        },
        ...payload,
      });

      if (AppConfig.logApiContract()) {
        console.debug('response:', JSON.stringify(data));
      }

      return data;
    } catch (error: any) {
      console.debug('HttpRequest.catch', error.message || error);
      return {success: false, error_msg: error.message || 'error!!'};
    }
  }
}

export default HttpRequest;
