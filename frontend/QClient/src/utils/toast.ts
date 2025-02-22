import { Platform, ToastAndroid } from "react-native";
import Toast from "react-native-toast-message";

export function showToast(message: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else if (Platform.OS === "ios") {
    // TODO: Test if this works on iOS
    Toast.show({
      type: "info",
      text1: message,
    });
  }
}
