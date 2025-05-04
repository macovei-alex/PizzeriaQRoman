import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GoBackButtonSvg from "src/components/svg/GoBackButtonSvg";
import useColorTheme from "src/hooks/useColorTheme";
import { ImageFile, imageOrDefault } from "src/utils/files";
import { ProductWithOptions } from "src/api/types/Product";
import logger from "src/utils/logger";
import { useNavigation } from "@react-navigation/native";
import { formatPrice } from "src/utils/utils";

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
          {product.subtitle} - {formatPrice(product.price)}
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
    marginHorizontal: 8,
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
