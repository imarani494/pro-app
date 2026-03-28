import * as Keychain from 'react-native-keychain';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import CryptoJS from 'crypto-js';

class SecureStorageUtil {
  static async initialize(authToken: string) {
    console.debug('SecureStorage.initialize');
    try {
      await SecureStorageUtil.setSecretKey('authToken', authToken);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  static async setEncryptedData(key: string, data: any) {
    try {
      let secretKey = await SecureStorageUtil.getSecretKey('secretKey');

      // Generate a secret key if none exists
      if (!secretKey) {
        secretKey = CryptoJS.lib.WordArray.random(256 / 8).toString();
        await SecureStorageUtil.setSecretKey('secretKey', secretKey);
        console.debug('Generated new secret key for encryption');
      }

      const jsonData = JSON.stringify(data);

      try {
        // Try encryption with better error handling
        const encryptedData = AES.encrypt(jsonData, secretKey).toString();
        await Keychain.setInternetCredentials(key, key, encryptedData);
        console.debug(`Successfully encrypted and stored ${key}`);
      } catch (encryptError) {
        console.warn(
          `Encryption failed for ${key}, storing without encryption:`,
          encryptError,
        );
        // Fallback: store without encryption
        await SecureStorageUtil.setSecretKey(key, data);
      }
    } catch (error) {
      console.error('Error in setEncryptedData:', error);
      // Final fallback: store without encryption
      try {
        await SecureStorageUtil.setSecretKey(key, data);
      } catch (fallbackError) {
        console.error('Fallback storage also failed:', fallbackError);
      }
    }
  }

  static async getDecryptedData(key: string) {
    try {
      const credentials = await Keychain.getInternetCredentials(key);
      if (!credentials || credentials.username !== key) {
        return null;
      }

      const secretKey = await SecureStorageUtil.getSecretKey('secretKey');
      if (!secretKey) {
        console.warn(
          `No secret key found, trying to get ${key} as unencrypted`,
        );
        return await SecureStorageUtil.getSecretKey(key);
      }

      try {
        // Try decryption
        const bytes = AES.decrypt(credentials.password, secretKey);
        const decryptedData = bytes.toString(Utf8);

        // Validate decrypted data
        if (!decryptedData || decryptedData.trim() === '') {
          console.warn(
            `Decrypted data for ${key} is empty, trying as unencrypted`,
          );
          return await SecureStorageUtil.getSecretKey(key);
        }

        const parsedData = JSON.parse(decryptedData);
        console.debug(`Successfully decrypted ${key}`);
        return parsedData;
      } catch (decryptError) {
        console.warn(
          `Failed to decrypt ${key}, trying as unencrypted:`,
          decryptError,
        );
        // Fallback: try to get as unencrypted data
        return await SecureStorageUtil.getSecretKey(key);
      }
    } catch (error) {
      console.error(`Error retrieving encrypted data for key: ${key}`, error);
      return null;
    }
  }

  static async setSecretKey(key: string, data: any) {
    try {
      // Handle null/undefined data
      if (data === null || data === undefined) {
        console.warn(`Attempting to store null/undefined data for key: ${key}`);
        return;
      }

      const jsonData = JSON.stringify(data);
      await Keychain.setInternetCredentials(key, key, jsonData);
    } catch (error) {
      console.error(`Error storing data for key: ${key}`, error);
    }
  }

  static async getSecretKey(key: string) {
    try {
      const credentials = await Keychain.getInternetCredentials(key);
      if (credentials && credentials.password) {
        try {
          return JSON.parse(credentials.password);
        } catch (parseError) {
          console.warn(
            `Failed to parse JSON for key ${key}, returning raw value`,
          );
          return credentials.password;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error retrieving data for key: ${key}`, error);
      return null;
    }
  }

  static async resetKeys(keys: string[]) {
    try {
      for (const key of keys) {
        await Keychain.resetInternetCredentials({server: key});
        console.debug('Reset key successfully:', key);
      }
    } catch (error) {
      console.error('Error resetting credentials', error);
    }
  }

  static async deleteData() {
    const STORED_KEYS = [
      'fcmToken',
      'userAccountData',
      'secretKey',
      'authToken',
      'userCnf',
      'userLoginDetails',
    ];
    await SecureStorageUtil.resetKeys(STORED_KEYS);
  }
}

export default SecureStorageUtil;
