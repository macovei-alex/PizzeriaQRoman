import { MMKV } from "react-native-mmkv";
import logger from "src/constants/logger";

class CustomStorage extends MMKV {
  setObject<T>(key: string, value: T) {
    this.set(key, JSON.stringify(value));
  }

  getObject<T>(key: string): T | null {
    const value = this.getString(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        logger.error("Error parsing JSON from MMKV:", e);
        return null;
      }
    }
    return null;
  }
}

export const storage = new CustomStorage();
