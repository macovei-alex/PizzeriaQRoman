import { images } from "@/constants";
import * as FileSystem from "expo-file-system";
import logger from "./logger";

export type ImageFile = { name: string; data: string | null };
export type ValidImageFile = { name: string; data: string };

export function imageOrDefault(image: ImageFile) {
  return image?.data ? { uri: image.data } : images.pizzaDemo;
}

export async function saveSingleImageToFile(image: ValidImageFile) {
  const fileUri = FileSystem.documentDirectory + image.name;
  try {
    await FileSystem.writeAsStringAsync(fileUri, image.data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return true;
  } catch (error) {
    logger.error(`error saving image ${image.name}: ${error}`);
    return false;
  }
}

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
  const results = await Promise.all(imagePromises);
  return results.every((result) => result === true);
}

export async function loadSingleImageFromFile(imageName: string) {
  const fileUri = FileSystem.documentDirectory + imageName;
  const header = `data:image/${imageName.split(",").pop()};base64,`;
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists === false) {
    logger.error(`file ${fileUri} does not exist`);
    return { name: imageName, data: null } as ImageFile;
  }
  try {
    const contents = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return { name: imageName, data: header + contents } as ImageFile;
  } catch (error) {
    logger.error(`error loading image: ${error}`);
    return { name: imageName, data: null } as ImageFile;
  }
}

export async function deleteImages(imageNames: string[]) {
  let promises = [];
  for (const imageName of imageNames) {
    promises.push(FileSystem.deleteAsync(FileSystem.documentDirectory + imageName));
  }
  return Promise.all(promises);
}
