import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ProductId } from "src/api/types/Product";
import { useProductsMap } from "src/hooks/useProductsMap";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import logger from "src/utils/logger";
import RemoteImage from "../../generic/RemoteImage";
import { Feather } from "@expo/vector-icons";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "ChatScreen">;

type ProductLinkProps = {
  productIds: ProductId[];
};

export default function ProductLinks({ productIds }: ProductLinkProps) {
  logger.render("ProductLinks");

  const { theme } = useUnistyles();
  const navigation = useNavigation<NavigationProps>();
  const productsMap = useProductsMap();

  return (
    <>
      {productIds.map((productId) => {
        const product = productsMap.get(productId);
        if (!product) return null;
        return (
          <TouchableOpacity
            key={product.id}
            style={styles.linkButton}
            onPress={() =>
              navigation.navigate("MainTabNavigator", {
                screen: "MenuStackNavigator",
                params: {
                  screen: "ProductScreen",
                  params: { productId: product.id },
                },
              })
            }
          >
            <RemoteImage
              imageName={product.imageName}
              imageVersion={product.imageVersion}
              style={styles.image}
            />
            <Text style={styles.linkText}>{product.name}</Text>
            <Feather style={styles.icon} name="arrow-right" size={24} color={theme.text.onAccent} />
          </TouchableOpacity>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    minWidth: "100%",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 9999,
    marginVertical: 4,
    backgroundColor: theme.background.accent,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    flexShrink: 1,
    color: theme.text.onAccent,
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 9999,
  },
  icon: {
    marginLeft: "auto",
  },
}));
