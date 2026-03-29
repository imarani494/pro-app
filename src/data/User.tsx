import SecureStorageUtil from '../utils/SecureStorageUtil';

class User {
  static userAccount: any = null;
  static authToken = '';
  static logoURL: any = null;

  static async initialize() {
    console.debug('User.initialize');
    const userAccountData = await SecureStorageUtil.getDecryptedData(
      'userAccountData',
    );

    if (userAccountData != null) {
      User.parseJSON(userAccountData);
    }
  }

  static isAgentUser() {
    return User?.userAccount?.role === 'TRAVEL_AGENT';
  }

  static isSystemUser() {
    return User?.userAccount?.systemUser || false;
  }

  static async parseJSON(data: any) {
    const userAccount = data.userAccount;
    if (userAccount?.authToken) {
      User.userAccount = data.userAccount;
      User.authToken = userAccount.authToken;
      User.logoURL = data?.logoURL || null;
      // Store authToken in secure storage for easy access
      await SecureStorageUtil.setSecretKey('authToken', userAccount.authToken);
    }
  }

  static async storeUserAccount(data: any) {
    try {
      await SecureStorageUtil.setEncryptedData('userAccountData', data);
    } catch (error) {
      console.debug(error);
    }
  }

  static async isLoggedIn() {
    const authToken = await SecureStorageUtil.getSecretKey('authToken');
    if (authToken) {
      return authToken?.password != '';
    }
  }

  static async getAuthToken() {
    const authToken = await SecureStorageUtil.getSecretKey('authToken');
    if (authToken) {
      return authToken;
    } else {
      return '';
    }
  }

  static getUserId() {
    if (!User.isLoggedIn()) {
      return null;
    }
    return User.userAccount?.userId;
  }

  static getUserName() {
    if (!User.isLoggedIn()) {
      return '';
    }
    return User.userAccount?.name;
  }

  static getUserEmail() {
    if (!User.isLoggedIn()) {
      return '';
    }
    return User.userAccount?.email;
  }
}

export default User;
