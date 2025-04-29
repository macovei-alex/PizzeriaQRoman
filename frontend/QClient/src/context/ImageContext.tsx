import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { ImageFile, loadSingleImageFromFile, saveImagesToFiles, ValidImageFile } from "src/utils/files";
import logger from "src/utils/logger";

type ImageContextType = {
  getSingleImage: (imageName: string) => Promise<ImageFile>;
  getImages: (imageNames: string[]) => Promise<ImageFile[]>;
  saveImages: (images: ValidImageFile[]) => Promise<boolean>;
  invalidateImageCache: () => void;
};

const ImageContext = createContext<ImageContextType | null>(null);

export function useImageContext() {
  const context = useContext(ImageContext);
  if (!context) throw new Error("useImageContext must be used within a ImageContextProvider");
  return context;
}

export function ImageContextProvider({ children }: { children: ReactNode }) {
  logger.render("ImageContextProvider");

  const [contextImages, setContextImages] = useState<ImageFile[]>([]);

  const getSingleImage = useCallback(
    async (imageName: string) => {
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
    },
    [contextImages]
  );

  const getImages = useCallback(
    async (imageNames: string[]) => {
      const imagePromises = [];
      for (const imageName of imageNames) {
        imagePromises.push(getSingleImage(imageName));
      }
      return Promise.all(imagePromises);
    },
    [getSingleImage]
  );

  const saveImages = useCallback(async (images: ValidImageFile[]) => {
    return saveImagesToFiles(images);
  }, []);

  const invalidateImageCache = useCallback(() => {
    setContextImages([]);
  }, []);

  return (
    <ImageContext.Provider value={{ getSingleImage, getImages, saveImages, invalidateImageCache }}>
      {children}
    </ImageContext.Provider>
  );
}
