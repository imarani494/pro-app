import analytics from "@react-native-firebase/analytics";
import { AppCrashlytics } from ".";

class AppAnalytics {
  static analytics: any;
  static initialize() {
    console.debug("AppAnalytics.initialize");
    AppAnalytics.analytics = analytics();
  }
  static async logEvent(key: string, val: any) {
    console.debug("logEvent", key, val);
    try {
      await AppAnalytics.analytics.logEvent(key, val);
      await AppCrashlytics.log({ [key]: val });
    } catch (error) {
      AppCrashlytics.recordError(error);
    }
  }
  static async setUserId(userId: string) {
    console.debug("setUserId", userId);
    await AppAnalytics.analytics.setUserId(userId);
    await AppCrashlytics.log({ userId: userId });
  }
  static async logScreenView(screenName: string, screenClass: any) {
    console.debug("logScreenView", screenName, screenClass);
    await AppAnalytics.analytics.logScreenView({
      screen_name: screenName,
      screen_class: screenClass,
    });
    await AppCrashlytics.log({ [screenName]: screenClass });
  }
}

export default AppAnalytics;
