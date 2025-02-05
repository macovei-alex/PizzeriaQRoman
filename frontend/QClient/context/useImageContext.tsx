import React, { createContext, ReactNode, useContext, useState } from "react";
import { ImageFile, loadSingleImageFromFile, saveImagesToFiles, ValidImageFile } from "@/utils/files";

type ImageContextType = {
  getSingleImage: (imageName: string) => Promise<ImageFile>;
  getImages: (imageNames: string[]) => Promise<ImageFile[]>;
  saveImages: (images: ValidImageFile[]) => Promise<boolean>;
  invalidateImageCache: () => void;
};

const ImageContext = createContext<ImageContextType | null>(null);

export function useImageContext() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within a ImageContextProvider");
  }
  return context;
}

export function ImageContextProvider({ children }: { children: ReactNode }) {
  const [contextImages, setContextImages] = useState<ImageFile[]>([]);

  async function getSingleImage(imageName: string) {
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

  async function getImages(imageNames: string[]) {
    const imagePromises = [];
    for (const imageName of imageNames) {
      imagePromises.push(getSingleImage(imageName));
    }
    return Promise.all(imagePromises);
  }

  async function saveImages(images: ValidImageFile[]) {
    return saveImagesToFiles(images);
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
