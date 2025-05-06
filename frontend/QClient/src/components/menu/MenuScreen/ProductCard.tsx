import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { Product } from "src/api/types/Product";
import logger from "src/utils/logger";
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
  const colorTheme = useColorTheme();

  return (
    <View style={[styles.container, { backgroundColor: colorTheme.background.card }]}>
      <RemoteImage imageName={product.imageName} imageVersion={product.imageVersion} style={styles.image} />

      <View style={styles.infoSection}>
        {/* title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: colorTheme.text.primary }]}>{product.name}</Text>
        </View>

        {/* subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={{ color: colorTheme.text.primary }}>{product.subtitle}</Text>
        </View>

        {/* price */}
        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: colorTheme.text.primary }]}>
            {formatPrice(product.price)}
          </Text>
        </View>

        {/* info button */}
        <TouchableOpacity
          testID={product.name === "Pizza Capriciosa" ? "info-button-capriciosa" : undefined}
          style={[styles.infoButtonContainer, { backgroundColor: colorTheme.background.accent }]}
          onPress={() => navigation.navigate("ProductScreen", { productId: product.id.toString() })}
        >
          <Text style={[styles.infoButtonText, { color: colorTheme.text.onAccent }]}>Informații</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginVertical: 20,
    borderRadius: 12,
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
  },
  subtitleContainer: {
    alignItems: "center",
  },
  priceContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexGrow: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoButtonContainer: {
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 14,
    marginBottom: -20,
    marginLeft: 16,
    marginRight: -16,
  },
  infoButtonText: {
    fontSize: 16,
  },
});
