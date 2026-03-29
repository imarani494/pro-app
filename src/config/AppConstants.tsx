import AppConfig from './AppConfig';

class AppConstants {
  static termsOfUseLink = '/gen/terms-of-use';
  static privacyPolicyLink = '/gen/privacy-policy';

  static getTermsOfUseLink = () => {
    return AppConfig.host + AppConstants.termsOfUseLink;
  };
  static getPrivacyPolicyLink = () => {
    return AppConfig.host + AppConstants.privacyPolicyLink;
  };
}

export default AppConstants;
