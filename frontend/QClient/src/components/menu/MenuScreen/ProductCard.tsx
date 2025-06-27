import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Product } from "src/api/types/Product";
import logger from "src/constants/logger";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MenuStackParamList } from "src/navigation/MenuStackNavigator";
import { formatPrice } from "src/utils/utils";
import { useNavigation } from "@react-navigation/native";
import RemoteImage from "src/components/shared/generic/RemoteImage";

type NavigationProps = NativeStackNavigationProp<MenuStackParamList, "MenuScreen">;
type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  logger.render("ProductCard");

  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
      <RemoteImage imageName={product.imageName} imageVersion={product.imageVersion} style={styles.image} />

      <View style={styles.infoSection}>
        {/* title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{product.name}</Text>
        </View>

        {/* subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>{product.subtitle}</Text>
        </View>

        {/* price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
        </View>

        {/* info button */}
        <TouchableOpacity
          testID={product.name === "Pizza Capriciosa" ? "info-button-capriciosa" : undefined}
          style={styles.infoButtonContainer}
          onPress={() => navigation.navigate("ProductScreen", { productId: product.id })}
        >
          <Text style={styles.infoButtonText}>Informații</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginVertical: 20,
    borderRadius: 12,
    backgroundColor: theme.background.card,
  },
  image: {
    aspectRatio: 1,
    width: "40%",
    marginHorizontal: "2%",
    marginVertical: "5%",
    borderRadius: 9999,
  },
  infoSection: {
    padding: 12,
    flexGrow: 1,
    flexShrink: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "900",
    color: theme.text.primary,
  },
  subtitleContainer: {
    alignItems: "center",
  },
  subtitleText: {
    color: theme.text.primary,
  },
  priceContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexGrow: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text.primary,
  },
  infoButtonContainer: {
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 14,
    marginBottom: -20,
    marginLeft: 16,
    marginRight: -16,
    backgroundColor: theme.background.accent,
  },
  infoButtonText: {
    fontSize: 16,
    color: theme.text.onAccent,
  },
}));
