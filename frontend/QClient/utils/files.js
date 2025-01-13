import { images } from "../constants";

/**
 * @param {{ name: string, data: string }} image
 * @returns {{ uri: string } | any}
 */
export function imageOrDefault(image) {
  return image?.data ? { uri: image.data } : images.pizzaDemo;
}
