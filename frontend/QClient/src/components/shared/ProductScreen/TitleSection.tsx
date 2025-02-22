import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GoBackButtonSvg from "@/components/svg/GoBackButtonSvg";
import useColorTheme from "@/hooks/useColorTheme";
import { ImageFile, imageOrDefault } from "@/utils/files";
import { ProductWithOptions } from "@/api/types/Product";
import logger from "@/utils/logger";
import { useNavigation } from "@react-navigation/native";

type TitleSectionProps = {
  product: ProductWithOptions;
  productImage: ImageFile;
};

export default function TitleSection({ product, productImage }: TitleSectionProps) {
  logger.render("TitleSection");

  const navigation = useNavigation();
  const colorTheme = useColorTheme();

  return (
    <>
      <ImageBackground source={imageOrDefault(productImage)} style={styles.image}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <GoBackButtonSvg />
        </TouchableOpacity>
      </ImageBackground>
      <Text style={[styles.titleText, { color: colorTheme.text.primary }]}>{product.name}</Text>
      <View style={styles.subtitleContainer}>
        <Text style={[styles.subtitleText, { color: colorTheme.text.primary }]}>
          {product.subtitle} - {product.price.toFixed(2)} lei
        </Text>
      </View>
      <Text style={[styles.descriptionText, { color: colorTheme.text.secondary }]}>
        {product.description}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    width: "100%",
  },
  goBackButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 38,
    height: 38,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "800",
    marginHorizontal: 12,
    marginTop: 12,
  },
  subtitleContainer: {
    width: "100%",
    alignItems: "center",
  },
  subtitleText: {
    fontSize: 20,
  },
  descriptionText: {
    marginTop: 20,
    marginHorizontal: 12,
    fontSize: 13,
  },
});
