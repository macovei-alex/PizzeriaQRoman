import { images } from "src/constants";
import * as FileSystem from "expo-file-system";
import logger from "./logger";

export type ImageFile = { name: string; data: string | null };
export type ValidImageFile = { name: string; data: string };

export function imageOrDefault(image: ImageFile | null): any {
  if (!image) return images.defaultPizza;
  if (image.data) return { uri: image.data };
  return images.defaultPizza;
}

/**
 * Might reject.
 */
export async function saveSingleImageToFile(image: ValidImageFile) {
  const fileUri = FileSystem.documentDirectory + image.name;
  await FileSystem.writeAsStringAsync(fileUri, image.data, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

/**
 * Function never rejects.
 * @returns An array of errors for the images that failed to save.
 */
export async function saveImagesToFiles(images: ValidImageFile[]) {
  const imagePromises = [];
  for (const img of images) {
    imagePromises.push(
      saveSingleImageToFile({
        name: img.name,
        data: img.data.includes(",") ? img.data.split(",")[1] : img.data,
      })
    );
  }
  const results = await Promise.allSettled(imagePromises);
  return results.filter((res) => res.status === "rejected").map((res) => res.reason);
}

/**
 * Never rejects.
 */
export async function loadSingleImageFromFile(imageName: string) {
  const fileUri = FileSystem.documentDirectory + imageName;
  const header = `data:image/${imageName.split(",").pop()};base64,`;
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists === false) {
    return { name: imageName, data: null } as ImageFile;
  }
  try {
    const contents = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return { name: imageName, data: header + contents } as ImageFile;
  } catch (error) {
    logger.error(`error loading image ${imageName}: ${error}`);
    return { name: imageName, data: null } as ImageFile;
  }
}

/**
 * Function never rejects.
 * @returns An array of errors for the images that failed to delete.
 */
export async function deleteImages(imageNames: string[]) {
  let promises = [];
  for (const imageName of imageNames) {
    promises.push(FileSystem.deleteAsync(FileSystem.documentDirectory + imageName));
  }
  const results = await Promise.allSettled(promises);
  return results.filter((res) => res.status === "rejected").map((res) => res.reason);
}
