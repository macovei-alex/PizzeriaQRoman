import React, { createContext, useContext, useState } from "react";
import * as FileSystem from "expo-file-system";

/**
 * @param {{name: string, data: string}} image
 * @returns {Promise<boolean>}
 */
async function saveSingleImageToFile(image) {
  const fileUri = FileSystem.documentDirectory + image.name;
  try {
    await FileSystem.writeAsStringAsync(fileUri, image.data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return true;
  } catch (error) {
    console.error(`error saving image ${image.name}: ${error}`);
    return false;
  }
}

/**
 * @param {{ name: string, data: string }[]} images
 * @returns {Promise<boolean>}
 */
async function saveImagesToFiles(images) {
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

/**
 * @param {string} imageName
 * @returns {Promise<{ name: string, data: string | null }>}
 */
async function loadSingleImageFromFile(imageName) {
  const fileUri = FileSystem.documentDirectory + imageName;
  const header = `data:image/${imageName.split(",").pop()};base64,`;
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists === false) {
    console.error(`file ${fileUri} does not exist`);
    return { name: imageName, data: null };
  }
  try {
    const contents = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return { name: imageName, data: header + contents };
  } catch (error) {
    console.error(`error loading image: ${error}`);
    return { name: imageName, data: null };
  }
}

const ImageContext = createContext();

/**
 * @returns {{
 *  getSingleImage: (imageName: string) => Promise<{ name: string, data: string | null }>,
 *  getImages: (imageNames: string[]) => Promise<{ name: string, data: string | null }[]>,
 *  saveImages: (images: {name: string, data: string}[]) => Promise<boolean>
 *  invalidateImageCache: () => void
 * }}
 */
export function useImageContext() {
  return useContext(ImageContext);
}

export function ImageContextProvider({ children }) {
  const [contextImages, setContextImages] = useState([]);

  /** @param {string} imageName */
  async function getSingleImage(imageName) {
    if (!imageName) {
      console.warn(`invalid ( imageName ) in getSingleImage: imageName is ${imageName}`);
      return { name: imageName, data: null };
    }
    if (typeof imageName !== "string") {
      console.error(
        `invalid ( imageName ) in getSingleImage: imageName is not a string, it is ${typeof imageName}`
      );
      return { name: imageName, data: null };
    }

    const found = contextImages.find((img) => img.name === imageName);
    if (found) {
      return found;
    }
    const newImage = await loadSingleImageFromFile(imageName);
    setContextImages((prev) => {
      const found = prev.find((img) => img.name === newImage.name);
      if (found) {
        found.data = newImage.data;
        return [...prev];
      } else {
        return [...prev, newImage];
      }
    });
    return newImage;
  }

  /** @param {string[]} imageNames */
  async function getImages(imageNames) {
    if (!imageNames) {
      console.warn(`invalid ( imageNames ) in getImages: imageNames is ${imageNames}`);
      return [];
    }
    if (!Array.isArray(imageNames)) {
      console.error(
        `invalid ( imageNames ) in getImages: imageNames is not an array, it is ${typeof imageNames}`
      );
      return [];
    }

    const imagePromises = [];
    for (const imageName of imageNames) {
      imagePromises.push(getSingleImage(imageName));
    }
    return await Promise.all(imagePromises);
  }

  /** @param {{name: string, data: string}[]} images */
  async function saveImages(images) {
    if (!Array.isArray(images)) {
      console.error(`invalid ( images ) in saveImages: images is not an array, it is ${typeof images}`);
      return false;
    }
    if (!images.every((img) => img ?? false)) {
      console.error(`invalid ( images ) in saveImages: one or more images is null/undefined`);
      return false;
    }
    if (
      !images.every(
        (img) => img.name && img.data && typeof img.name === "string" && typeof img.data === "string"
      )
    ) {
      console.error(`invalid ( images ) in saveImages: one or more images is missing name or data`);
      return false;
    }

    return await saveImagesToFiles(images);
  }

  function invalidateImageCache() {
    setContextImages(() => []);
  }

  return (
    <ImageContext.Provider value={{ getSingleImage, getImages, saveImages, invalidateImageCache }}>
      {children}
    </ImageContext.Provider>
  );
}
