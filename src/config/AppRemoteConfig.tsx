import remoteConfig from '@react-native-firebase/remote-config';

class AppRemoteConfig {
  static disableSSLPinning = true;

  static async initialize() {
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 10000,
      fetchTimeMillis: 10000,
    });
    console.debug('AppRemoteConfig.initialize');
  }

  static async fetchAndActivate() {
    console.debug('AppRemoteConfig.fetchAndActivate Start');
    await remoteConfig()
      .fetchAndActivate()
      .then(activated => {
        if (activated) {
          AppRemoteConfig.disableSSLPinning = remoteConfig()
            .getValue('yourholidayapp_ssl_pinning_disabled')
            .asBoolean();
        }
        return activated;
      })
      .catch(error => console.error(error));
  }
}

export default AppRemoteConfig;
