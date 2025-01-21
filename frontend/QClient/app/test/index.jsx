import { View, StyleSheet, Platform, ScrollView, Text, Image, TouchableOpacity } from "react-native";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { useQuery } from "react-query";
import api from "../../api";
import HomeIconSvg from "../../components/svg/HomeIconSvg";
import { router } from "expo-router";
import { useImageContext } from "../../context/useImageContext";

export default function TestComponent() {
  const imageContext = useImageContext();

  const newImagesQuery = useQuery({
    queryFn: async () => {
      if (await api.fetchImageRefetchCheck("yes")) {
        return api.fetchImages();
      }
      return Promise.resolve([]);
    },
    queryKey: "test-images",
  });

  const productsQuery = useQuery({
    queryFn: api.fetchProducts,
    queryKey: "test-products",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!newImagesQuery.data || !productsQuery.data) {
      return;
    }

    let imagesToLoad = newImagesQuery.data.map((image) => image.name);
    let imagesToSave = newImagesQuery.data;
    if (newImagesQuery.data.length === 0) {
      imagesToLoad = productsQuery.data.map((product) => product.imageName);
    }

    async function processImages() {
      try {
        await imageContext.saveImages(imagesToSave);
        const loaded = await imageContext.getImages(imagesToLoad);
        setImages(loaded);
      } catch (error) {
        console.error("Error processing images:", error);
      }
    }

    processImages();
  }, [newImagesQuery.data, productsQuery.data]);

  if (newImagesQuery.isLoading) {
    return <Text>Loading new images from server...</Text>;
  }
  if (newImagesQuery.isError) {
    return <Text>Error: {newImagesQuery.error.message}</Text>;
  }

  if (images.length == 0) {
    return <Text>Loading images from disk...</Text>;
  }

  return (
    <SafeAreaView>
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
