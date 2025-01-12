import * as FileSystem from "expo-file-system";

/**
 * @param {string} imageName
 * @param {string} imageData
 * @returns {Promise<void>}
 */
async function saveSingleImage(imageName, imageData) {
  const fileUri = FileSystem.documentDirectory + imageName;
  try {
    await FileSystem.writeAsStringAsync(fileUri, imageData, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch (error) {
    console.error("error saving image", error);
  }
}

/**
 * @param { { name: string, data: string }[] } imagesArray
 * @returns {Promise<void>}
 */
export async function saveImages(imagesArray) {
  for (const image of imagesArray) {
    await saveSingleImage(image.name, image.data.split(",")[1]);
  }
}

/**
 * @param {string} imageName
 * @returns {Promise<{ name: string, data: string }>}
 */
export async function loadSingleImage(imageName) {
  const fileUri = FileSystem.documentDirectory + imageName;
  const header = `data:image/${imageName.split(",").pop()};base64,`;
  const contents = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return {
    name: imageName,
    data: header + contents,
  };
}

/**
 * @param {string[]} imageNames
 * @returns {Promise<{ name: string, data: string }[]>}
 */
export async function loadImages(imageNames) {
  const images = [];
  for (const imageName of imageNames) {
    images.push(await loadSingleImage(imageName));
  }
  return images;
}
