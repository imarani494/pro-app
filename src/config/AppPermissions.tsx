import { Alert, Platform } from "react-native";
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
} from "react-native-permissions";
import { AppConfig } from ".";

type PermissionStatus =
  | "unavailable"
  | "denied"
  | "limited"
  | "granted"
  | "blocked";

class AppPermissions {
  static async initialize() {
    console.debug("AppPermissions initialize");
  }
}
export default AppPermissions;
