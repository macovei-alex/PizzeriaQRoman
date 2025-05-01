import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api } from "src/api";
import { ImageFile, loadSingleImageFromFile, saveImagesToFiles, ValidImageFile } from "src/utils/files";
import logger from "src/utils/logger";
import { useAuthContext } from "./AuthContext";
import { CanceledError } from "axios";

type ImageContextType = {
  getSingleImage: (imageName: string) => Promise<ImageFile>;
  getImages: (imageNames: string[]) => Promise<PromiseSettledResult<ImageFile>[]>;
  refetchImages: () => Promise<void>;
};

const ImageContext = createContext<ImageContextType | null>(null);

export function useImageContext() {
  const context = useContext(ImageContext);
  if (!context) throw new Error("useImageContext must be used within a ImageContextProvider");
  return context;
}

export function ImageContextProvider({ children }: { children: ReactNode }) {
  logger.render("ImageContextProvider");

  const authContext = useAuthContext();
  const [contextImages, setContextImages] = useState<ImageFile[]>([]);

  const refetchImages = useCallback(async () => {
    let newImages: ValidImageFile[] = [];
    try {
      newImages = (await api.axios.get<ValidImageFile[]>("/image/all")).data;
    } catch (error) {
      logger.error(`Error fetching images: ${error}`);
      return;
    }

    if (newImages.length === 0) return;

    setContextImages((prev) => {
      const newImageNames = newImages.map((img) => img.name);
      const existingImages = prev.filter((img) => !newImageNames.includes(img.name));
      return [...existingImages, ...newImages];
    });

    const errors = await saveImagesToFiles(newImages);
    errors.forEach((error) => {
      logger.error(`Error saving images: ${error}`);
    });
  }, []);

  const getSingleImage = useCallback(
    async (imageName: string) => {
      const found = contextImages.find((img) => img.name === imageName);
      if (found) return found;

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
      return Promise.allSettled(imagePromises);
    },
    [getSingleImage]
  );

  const firstImageChangesState = useRef(false);

  useEffect(() => {
    if (!authContext.isAuthenticated) return;
    if (firstImageChangesState.current) return;

    const abortController = new AbortController();
    api.axios
      .get<boolean>("/image/changes/yes", { signal: abortController.signal })
      .then((res) => {
        if (typeof res.data !== "boolean") throw new Error(`Invalid response: ${res.data}`);
        if (res.data) {
          firstImageChangesState.current = true;
          refetchImages();
        }
      })
      .catch((error) => {
        if (!(error instanceof CanceledError)) {
          logger.error(`Error fetching image changes: ${error}`);
        }
      });

    return () => abortController.abort();
  }, [refetchImages, authContext]);

  return (
    <ImageContext.Provider value={{ getSingleImage, getImages, refetchImages }}>
      {children}
    </ImageContext.Provider>
  );
}
