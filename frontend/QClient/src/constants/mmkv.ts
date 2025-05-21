import { MMKV } from "react-native-mmkv";

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
        console.error("Error parsing JSON from MMKV:", e);
        return null;
      }
    }
    return null;
  }
}

export const storage = new CustomStorage();
