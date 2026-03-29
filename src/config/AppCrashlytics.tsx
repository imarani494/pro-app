import crashlytics from "@react-native-firebase/crashlytics";
class AppCrashlytics {
  static log(data: any) {
    console.debug("crashlytics.log", data);
    crashlytics().log(JSON.stringify(data));
  }
  static recordError(error: any) {
    console.debug("crashlytics.recordError", error);
    crashlytics().recordError(error);
  }
}

export default AppCrashlytics;
