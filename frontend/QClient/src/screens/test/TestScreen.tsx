import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from "react-native";
import React, { Fragment, startTransition, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButtonSvg from "src/components/svg/GoBackButtonSvg";
import { useQuery } from "@tanstack/react-query";
import api from "src/api";
import { useImageContext } from "src/context/useImageContext";
import * as FileSystem from "expo-file-system";
import useProductsQuery from "src/hooks/useProductsQuery";
import { ImageFile, imageOrDefault, ValidImageFile } from "src/utils/files";
import logger from "src/utils/logger";

export default function TestScreen() {
  logger.render("TestScreen");

  const imageContext = useImageContext();
  const productsQuery = useProductsQuery();
  const [images, setImages] = useState<ImageFile[]>([]);

  const newImagesQuery = useQuery<ImageFile[], Error>({
    queryFn: async () => {
      if (await api.fetchImageRefetchCheck("yes")) {
        return api.fetchImages();
      }
      return [];
    },
    queryKey: ["test-images"],
  });

  useEffect(() => {
    if (!newImagesQuery.data || !productsQuery.data || newImagesQuery.isFetching) return;

    const imageNames = newImagesQuery.data.map((img) => img.name);
    const imagesToSave = newImagesQuery.data.filter((img) => !!img.data) as ValidImageFile[];

    async function processImages() {
      try {
        await imageContext.saveImages(imagesToSave);
        const loaded = await imageContext.getImages(imageNames);
        setImages(() => loaded);
      } catch (error) {
        logger.error(`Error processing images: ${error}`);
      }
    }

    processImages();
  }, [newImagesQuery.data, productsQuery.data, newImagesQuery.isFetching, imageContext]);

  async function deleteImages() {
    let promises = [];
    for (const image of images) {
      promises.push(FileSystem.deleteAsync(FileSystem.documentDirectory + image.name));
    }
    await Promise.all(promises);
    startTransition(() => {
      newImagesQuery.refetch();
      imageContext.invalidateImageCache();
    });
  }

  if (newImagesQuery.isFetching) {
    return <Text>Loading new images from server...</Text>;
  }
  if (newImagesQuery.isError) {
    return <Text>Error: {newImagesQuery.error.message}</Text>;
  }
  if (images.length === 0) {
    return <Text>Loading images from disk...</Text>;
  }

  return (
    <SafeAreaView>
      <TouchableOpacity style={{ backgroundColor: "red" }} onPress={deleteImages}>
        <Text style={{ color: "white" }}>Delete images from disk and refetch them</Text>
      </TouchableOpacity>
      <ScrollView>
        <TouchableOpacity>
          <GoBackButtonSvg style={{ width: 38, height: 38 }} />
        </TouchableOpacity>
        <View style={styles.container}>
          {images.map((image) => (
            <Fragment key={image.name}>
              <Text>{image.name}</Text>
              <Image source={imageOrDefault(image)} style={styles.image} />
            </Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 200,
    height: 200,
  },
});
