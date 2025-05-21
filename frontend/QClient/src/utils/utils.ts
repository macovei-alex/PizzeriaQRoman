import { ENV } from "src/constants/env";

export function formatDate(date?: Date) {
  return date
    ? date.toLocaleDateString("ro", { day: "2-digit", month: "2-digit" }) + "  " + formatTime(date)
    : "";
}

export function formatTime(date?: Date) {
  return date ? date.toLocaleTimeString("ro", { hour: "2-digit", minute: "2-digit" }) : "";
}

export function formatPrice(price: number) {
  return price.toFixed(2) + " RON";
}

export function imageUri(imageName: string, imageVersion: number) {
  return `${ENV.EXPO_PUBLIC_API_BASE_URL}/images/${imageName}?v=${imageVersion}`;
}
