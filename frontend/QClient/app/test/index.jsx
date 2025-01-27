import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { useQuery } from "react-query";
import api from "../../api";
import { useImageContext } from "../../context/useImageContext";
import * as FileSystem from "expo-file-system";
import useApiProducts from "../../hooks/useApiProducts";

export default function TestComponent() {
  const imageContext = useImageContext();
  const productsQuery = useApiProducts();

  const newImagesQuery = useQuery({
    queryFn: async () => {
      if (await api.fetchImageRefetchCheck("yes")) {
        return api.fetchImages();
      }
      return [];
    },
    queryKey: "test-images",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!newImagesQuery.data || !productsQuery.data) {
      return;
    }

    let imageNames = newImagesQuery.data.map((image) => image.name);
    let imagesToSave = newImagesQuery.data;

    async function processImages() {
      try {
        await imageContext.saveImages(imagesToSave);
        const loaded = await imageContext.getImages(imageNames);
        setImages(() => loaded);
      } catch (error) {
        console.error("Error processing images:", error);
      }
    }

    processImages();
  }, [newImagesQuery.data, productsQuery.data, imageContext]);

  async function deleteImages() {
    let promises = [];
    for (const image of images) {
      promises.push(FileSystem.deleteAsync(FileSystem.documentDirectory + image.name));
    }
    await Promise.all(promises);
    setImages(() => []);
    imageContext.invalidateImageCache();
    newImagesQuery.refetch();
  }

  if (newImagesQuery.isLoading || newImagesQuery.isFetching) {
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
          <GoBackButtonSVG style={{ width: 38, height: 38 }} />
        </TouchableOpacity>
        <View style={styles.container}>
          {images.map((image) => (
            <Fragment key={image.name}>
              <Text>{image.name}</Text>
              <Image source={{ uri: image.data }} style={styles.image} />
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
