import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButtonSvg from "src/components/svg/GoBackButtonSvg";
import { useImageContext } from "src/context/ImageContext";
import useProductsQuery from "src/api/hooks/useProductsQuery";
import { ImageFile, imageOrDefault } from "src/utils/files";
import logger from "src/utils/logger";

export default function TestScreen() {
  logger.render("TestScreen");

  const imageContext = useImageContext();
  const productsQuery = useProductsQuery();
  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    imageContext
      .getImages(productsQuery.data?.map((product) => product.imageName) ?? [])
      .then((images) => setImages(images.filter((img) => img.status === "fulfilled").map((img) => img.value)))
      .catch((error) => {
        logger.error(`Error fetching images: ${error}`);
      });
  }, [productsQuery.data, imageContext]);

  return (
    <SafeAreaView>
      <TouchableOpacity style={{ backgroundColor: "red" }} onPress={imageContext.refetchImages}>
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
