import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';

import packageJson from '../../package.json';
import SecureStorageUtil from '../utils/SecureStorageUtil';

class AppConfig {
  static host = 'https://krmui.typeyourtrip.com';
  // static host = 'https://www.yourholiday.me';
  static staticUrl = 'https://cdn.yourholiday.me';
  static application = AppConfig.isIOS()
    ? // ? 'com.tf.apple.tripfactorypro'
      // : 'com.tf.tripfactorypro';
      'com.dmcraja.apple.partner'
    : 'com.dmcraja.partner';
  static appVersionNum = packageJson.version.replace(/\./g, '');
  static appVersion = packageJson.version;
  static deviceId = '';
  static userAgent = '';
  static hasNotch = DeviceInfo.hasNotch();
  static isTablet = DeviceInfo.isTablet();
  static deviceInfo = {
    osVersion: DeviceInfo.getSystemName(),
    manufacturer: DeviceInfo.getBrand(),
    model: DeviceInfo.getModel(),
  };
  static timezone = RNLocalize.getTimeZone();

  //
  static forceUpdate = false;

  static gMapUrl = 'http://maps.google.com/maps';

  static async initialize() {
    console.debug('AppConfig.initialize');

    if (AppConfig.isDebugMode()) {
      console.debug('debug mode');
      AppConfig.host = 'https://krmui.typeyourtrip.com';
      if (AppConfig.isLocalhost()) {
        console.debug('local mode');
        AppConfig.host = AppConfig.isIOS()
          ? 'http://localhost'
          : 'http://10.0.2.2';
      }
    }

    AppConfig.deviceId = await DeviceInfo.getUniqueId().then(
      deviceId => deviceId,
    );
    AppConfig.userAgent = await DeviceInfo.getUserAgent().then(
      userAgent => userAgent,
    );
  }

  static isDebugMode() {
    return __DEV__;
  }
  static isLocalhost() {
    return false && AppConfig.isDebugMode();
  }
  static logApiContract() {
    return true && AppConfig.isDebugMode();
  }
  static isIOS() {
    return Platform.OS === 'ios';
  }

  static async reset() {
    SecureStorageUtil.deleteData();
  }

  static async authToken() {
    const authToken = await SecureStorageUtil.getSecretKey('authToken');
    if (authToken) {
      return authToken;
    } else {
      return '';
    }
  }

  static async appConfigParams(data: any) {
    const authToken = await AppConfig.authToken();
    return {
      application: AppConfig.application,
      device_id: AppConfig.deviceId,
      app_version: AppConfig.appVersion,
      isTablet: AppConfig.isTablet,
      userAgent: AppConfig.userAgent,
      data: JSON.stringify({
        ...AppConfig.deviceInfo,
        ...data,
      }),
      _auth: authToken,
      ...data,
    };
  }
  static appConfigGetParams(data: any) {
    return (
      'application=' +
      AppConfig.application +
      '&device_id=' +
      AppConfig.deviceId +
      '&app_version=' +
      AppConfig.appVersion
    );
  }
  static getDeviceInfo() {
    return AppConfig.deviceInfo;
  }
  static async setForceUpdateStatus(forceUpdate: boolean) {
    AppConfig.forceUpdate = forceUpdate || false;
  }
}

export default AppConfig;
