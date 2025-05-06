import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GoBackButtonSvg from "src/components/svg/GoBackButtonSvg";
import useColorTheme from "src/hooks/useColorTheme";
import { ProductWithOptions } from "src/api/types/Product";
import logger from "src/utils/logger";
import { useNavigation } from "@react-navigation/native";
import { formatPrice } from "src/utils/utils";
import RemoteImageBackground from "../generic/RemoteImageBackground";

type TitleSectionProps = {
  product: ProductWithOptions;
};

export default function TitleSection({ product }: TitleSectionProps) {
  logger.render("TitleSection");

  const navigation = useNavigation();
  const colorTheme = useColorTheme();

  return (
    <>
      <RemoteImageBackground
        imageName={product.imageName}
        imageVersion={product.imageVersion}
        style={styles.image}
      >
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <GoBackButtonSvg />
        </TouchableOpacity>
      </RemoteImageBackground>
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
    marginTop: -4,
    marginHorizontal: 8,
    alignItems: "center",
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: "500",
  },
  descriptionText: {
    marginTop: 20,
    marginHorizontal: 12,
    fontSize: 13,
  },
});
