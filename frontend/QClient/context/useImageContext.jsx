import React, { createContext, useContext, useState } from "react";
import * as FileSystem from "expo-file-system";

/**
 * @param {{name: string, data: string}} image
 * @returns {Promise<boolean>}
 */
async function saveSingleImageToFile(image) {
  if (!image) {
    console.error("invalid image: image is", image);
    return false;
  }
  if (!image.name) {
    console.error("invalid image: image.name is", image.name);
    return false;
  }
  if (!image.data) {
    console.error("invalid image: image.data is", image.data);
    return false;
  }

  const fileUri = FileSystem.documentDirectory + image.name;
  try {
    await FileSystem.writeAsStringAsync(fileUri, image.data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return true;
  } catch (error) {
    console.error(`error saving image ${image.name}:`, error);
    return false;
  }
}

/**
 * @param {{ name: string, data: string }[]} imagesArray
 * @returns {Promise<boolean>}
 */
async function saveImagesToFiles(imagesArray) {
  if (!imagesArray) {
    console.error("invalid imagesArray: imagesArray is", imagesArray);
    return false;
  }
  if (!Array.isArray(imagesArray)) {
    console.error("invalid imagesArray: imagesArray is not an array");
    return false;
  }

  const imagePromises = [];
  for (const image of imagesArray) {
    imagePromises.push(
      saveSingleImageToFile({
        name: image.name,
        data: image.data.includes(",") ? image.data.split(",")[1] : image.data,
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
  if (!imageName) {
    console.error("invalid imageName: imageName is", imageName);
    return { name: imageName, data: null };
  }

  const fileUri = FileSystem.documentDirectory + imageName;
  const header = `data:image/${imageName.split(",").pop()};base64,`;
  try {
    const contents = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return { name: imageName, data: header + contents };
  } catch (error) {
    console.error("error loading image:", error);
    return { name: imageName, data: null };
  }
}

const ImageContext = createContext();

/**
 * @returns {{
 *  getSingleImage: (imageName: string) => Promise<{ name: string, data: string | null }>,
 *  getImages: (imageNames: string[]) => Promise<{ name: string, data: string | null }[]>,
 *  saveImages: (imageNames: string[]) => Promise<boolean>
 * }}
 */
export function useImageContext() {
  return useContext(ImageContext);
}

export function ImageContextProvider({ children }) {
  const [images, setImages] = useState([]);

  async function getSingleImage(imageName) {
    if (!imageName) {
      return { name: imageName, data: null };
    }
    const found = images.find((img) => img.name === imageName);
    if (found) {
      return found;
    }
    const newImage = await loadSingleImageFromFile(imageName);
    setImages((prev) => [...prev, newImage]);
    return newImage;
  }

  async function getImages(imageNames) {
    if (!imageNames) {
      console.warn("invalid imageNames in getImages: imageNames is", imageNames);
      return Promise.resolve([]);
    }
    if (!Array.isArray(imageNames)) {
      console.error("invalid imageNames in getImages: imageNames is not an array");
      return Promise.resolve([]);
    }

    const imagePromises = [];
    for (const imageName of imageNames) {
      imagePromises.push(getSingleImage(imageName));
    }
    return Promise.all(imagePromises);
  }

  async function saveImages(imageNames) {
    if (!imageNames) {
      console.warn("invalid imageNames in saveImages: imageNames is", imageNames);
      return false;
    }
    if (!Array.isArray(imageNames)) {
      console.error("invalid imageNames in saveImages: imageNames is not an array");
      return false;
    }

    return await saveImagesToFiles(imageNames);
  }

  return (
    <ImageContext.Provider value={{ getSingleImage, getImages, saveImages }}>
      {children}
    </ImageContext.Provider>
  );
}
