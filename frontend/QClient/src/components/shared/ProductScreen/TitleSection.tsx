import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import GoBackButtonSvg from "src/components/svg/GoBackButtonSvg";
import { ProductWithOptions } from "src/api/types/Product";
import logger from "src/constants/logger";
import { useNavigation } from "@react-navigation/native";
import { formatPrice } from "src/utils/utils";
import RemoteImageBackground from "../generic/RemoteImageBackground";

type TitleSectionProps = {
  product: ProductWithOptions;
};

export default function TitleSection({ product }: TitleSectionProps) {
  logger.render("TitleSection");

  const navigation = useNavigation();

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
      <Text style={styles.titleText}>{product.name}</Text>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>{product.subtitle}</Text>
        <Text style={styles.subtitleText}>-</Text>
        <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
      </View>
      <Text style={styles.descriptionText}>{product.description}</Text>
    </>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  image: {
    aspectRatio: 1,
    width: "100%",
  },
  goBackButton: {
    position: "absolute",
    top: runtime.insets.top + 4,
    left: 20,
    width: 38,
    height: 38,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "800",
    marginHorizontal: 12,
    marginTop: 12,
    color: theme.text.primary,
  },
  subtitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    gap: 6,
  },
  subtitleText: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: "500",
    color: theme.text.primary,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "500",
    color: theme.text.primary,
  },
  descriptionText: {
    marginTop: 20,
    marginHorizontal: 12,
    fontSize: 14,
    color: theme.text.secondary,
  },
}));
