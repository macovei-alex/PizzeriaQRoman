import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import logger from "src/utils/logger";
import axios from "axios";
import { api } from "src/api";
import { storage } from "src/constants/mmkv";

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    logger.warn("Must use physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus !== "granted") {
    const lastNotificationToken = storage.getString("notificationToken");
    if (lastNotificationToken === undefined) {
      // User never accepted push notifications, so we need to ask for permission
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        logger.warn("Permission not granted for push notifications");
        storage.set("notificationToken", "revoked");
        storage.delete("notificationTokenSent");
        return null;
      }
    } else {
      // User accepted push notifications before, but has blocked them since, so we don't want to ask again
      if (lastNotificationToken !== "revoked") {
        api.axios.delete(api.routes.devices, { data: { token: lastNotificationToken } });
        storage.set("notificationToken", "revoked");
        storage.delete("notificationTokenSent");
      }
      return null;
    }
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) throw new Error("Project ID not found in EAS config");

  try {
    const lastToken = storage.getString("notificationToken");
    const tokenSent = storage.getBoolean("notificationTokenSent");
    const newToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    if (lastToken === newToken && tokenSent) {
      // User has push notifications permissions enabled and token has been sent to server
      return lastToken;
    } else if (lastToken === newToken && !tokenSent) {
      // User has push notifications permissions enabled, but token has not been sent to server
      await api.axios.post(api.routes.devices, { token: lastToken });
      storage.set("notificationTokenSent", true);
      return lastToken;
    } else if (lastToken !== newToken) {
      // User has just accepted push notifications, so token is sent to server
      storage.set("notificationToken", newToken);
      await api.axios.post(api.routes.devices, { token: newToken });
      storage.set("notificationTokenSent", true);
      return newToken;
    } else {
      logger.error("Last token: ", lastToken);
      logger.error("New token: ", newToken);
      logger.error("Token sent: ", tokenSent);
      throw new Error("Notification token registering should never be able to reach this");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      storage.delete("notificationTokenSent");
      throw error;
    } else if (error instanceof Error) throw new Error("Error sending Expo Push Token: " + error.message);
    else if (typeof error === "string") throw new Error("Error getting Expo Push Token: " + error);
    throw new Error("Error getting Expo Push Token");
  }
}

type NotificationContextType = {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
}

export default function NotificationProvider({ children }: { children: React.ReactElement }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => {
        logger.error("Error getting Expo Push Token: ", error);
        setError(error);
      }
    );

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      // While the app is running
      console.log("Notification received: ", JSON.stringify(notification.request.content.data, null, 2));
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // When the user taps on the notification
      console.log(
        "Notification response received: ",
        JSON.stringify(response.notification.request.content.data, null, 2)
      );
    });

    return () => {
      if (notificationListener.current) notificationListener.current?.remove();
      if (responseListener.current) responseListener.current?.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
}
