import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";

import notifee from "@notifee/react-native";

import { AppAnalytics, AppConfig, AppCrashlytics } from ".";
import { UrlHandler } from "../utils";
import { User } from "../data";
import SecureStorageUtil from "../utils/SecureStorageUtil";
import RNFS from "react-native-fs";

const SOUND_FILE_NAME = "notify.mp3";
const SOUND_URL = "https://cdn.yourholiday.me/static/im/notify.mp3";
const SOUND_PATH = `${RNFS.DocumentDirectoryPath}/${SOUND_FILE_NAME}`;

async function downloadNotificationSound() {
  try {
    const fileExists = await RNFS.exists(SOUND_PATH);
    if (!fileExists) {
      await RNFS.downloadFile({
        fromUrl: SOUND_URL,
        toFile: SOUND_PATH,
      }).promise;
      console.log("Sound file downloaded!");
    }
  } catch (error) {
    console.log("Error downloading sound:", error);
  }
}

class AppPushNotification {
  static GcmSenderId = "401558579806";
  static fcmToken: string = "";
  static isFcmReg: boolean = false;
  static channelId: any;
  static secretKey = "crypto_secretKey";

  static async initialize(navigation: any, callBack: any = null) {
    console.debug("AppPushNotification.initialize");

    if (AppConfig.isDebugMode()) {
      await messaging().setAPNSToken(
        AppPushNotification.GcmSenderId,
        "unknown"
      );
    }

    const fcmToken = await SecureStorageUtil.getDecryptedData("fcmToken");

    if (fcmToken != null) {
      AppPushNotification.fcmToken = fcmToken;
      AppPushNotification.isFcmReg = true;
    }
    if (!AppConfig.isIOS()) {
      await AppPushNotification.requestAndroidPermission();
    }
    await AppPushNotification.requestPermission();
    await AppPushNotification.createChannel();
    await AppPushNotification.initialNotificationListener(navigation, callBack);
    await AppPushNotification.onNotificationOpenedApp(navigation, callBack);
    await AppPushNotification.onMessage(navigation, callBack);
  }

  static async requestAndroidPermission() {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }

  static async requestPermission() {
    try {
      const authorizationStatus = await messaging().requestPermission();

      if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        AppAnalytics.logEvent("pushNotification_permission", {
          decision: "allowed",
        });
      } else if (
        authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        AppAnalytics.logEvent("pushNotification_permission", {
          decision: "allowed provisional",
        });
      } else {
        AppAnalytics.logEvent("pushNotification_permission", {
          decision: "denied",
        });
      }
    } catch (error) {
      // User has rejected permissions
      AppAnalytics.logEvent("pushNotification_permission", {
        decision: "denied",
      });
    }
  }

  static async getToken() {
    try {
      if (AppPushNotification.fcmToken != "") {
        return AppPushNotification.fcmToken;
      }
      if (!AppConfig.isIOS()) {
        await messaging().registerDeviceForRemoteMessages();
      }
      const fcmToken = await messaging().getToken();
      await SecureStorageUtil.setEncryptedData("fcmTokenKey", fcmToken);
      return fcmToken;
    } catch (error) {
      AppCrashlytics.recordError(error);
      return "";
    }
  }
  static async createChannel() {
    // Create a channel (required for Android)
    AppPushNotification.channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
  }
  static initialNotificationListener(navigation: any, callBack: any = null) {
    return messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.debug(
            "When the application is opened from a quit state",
            remoteMessage
          );
          AppPushNotification.navigate(navigation, remoteMessage, callBack);
        }
      });
  }

  static onNotificationOpenedApp(navigation: any, callBack: any = null) {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.debug(
        "When the application is running, but in the background",
        remoteMessage
      );
      AppPushNotification.navigate(navigation, remoteMessage, callBack);
    });
  }
  static onMessage(navigation: any, callBack: any = null) {
    return messaging().onMessage(async (remoteMessage: any) => {
      console.debug("When the application is Foreground", remoteMessage);
      AppPushNotification.displayNotification(remoteMessage);
    });
  }
  static async displayNotification(remoteMessage: any) {
    await downloadNotificationSound();

    try {
      let channelId: any = await AppPushNotification.createChannel();
      let title: any = remoteMessage?.notification?.title;
      let body: any = remoteMessage?.notification?.body;
      if (remoteMessage?.data?.sendbird) {
        let sendbird = JSON.parse(remoteMessage?.data?.sendbird);
        title = sendbird?.channel?.name;
        body = remoteMessage?.data?.message;
        channelId = await notifee.createChannel({
          id: "sendbird?.channel?.channel_url",
          name: `${sendbird?.channel?.channel_url} Channel`,
          sound: "notify",
        });
      }
      // Display a notification
      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: channelId,
          smallIcon: "ic_notification",
          sound: "notify",
        },
        data: remoteMessage.data,
      });
    } catch (error) {
      AppCrashlytics.log(error);
    }
  }

  static backgroundMessageHandler() {
    return messaging().setBackgroundMessageHandler(
      async (remoteMessage: any) => {
        console.debug("Message handled in the background!", remoteMessage);
        AppPushNotification.displayNotification(remoteMessage);
      }
    );
  }
  static navigate(navigation: any, remoteMessage: any, callBack: any = null) {
    const data = remoteMessage.data;
    let innerData = data?.data;
    if (typeof data?.data === "string") {
      innerData = JSON.parse(data?.data);
    }
    const urlDetails = UrlHandler.getParseUrl(innerData?.url);
    let screenName: string = "Internal";
    let params: any = { url: innerData?.url };

    if (
      !User.isLoggedIn() &&
      urlDetails?.pathname.indexOf("conversation/join/") >= 0
    ) {
      screenName = "Onboarding";
      params = {
        eId: urlDetails?.pathname.split("/").pop(),
      };
    } else if (urlDetails?.pathname.indexOf("/trip/edit-trip-itinerary") >= 0) {
      screenName = "ItineraryDetails";
      params = urlDetails?.query;
    } else if (urlDetails?.pathname.indexOf("conversation/messages/") >= 0) {
      screenName = "GroupChannel";
      params = {
        channelUrl: urlDetails?.pathname.split("/").pop(),
        disconnOnBack: true,
      };
      // } else if (urlDetails?.pathname.indexOf("conversation/messages") >= 0) {
      //   screenName = "GroupChannelList";
      //   params = {};
    } else {
      if (data?.wdata) {
        let url = UrlHandler.checkUrl(
          UrlHandler.insAllParams("/gen/msc/handle-web-push", {
            _mapp_: "true",
            data: encodeURI(data.wdata),
          })
        );
        params = { url };
      }
    }
    setTimeout(() => {
      if (callBack) {
        callBack(screenName, params);
      } else {
        navigation.navigate(screenName, params);
      }
    }, 1000);
  }
}

export default AppPushNotification;
