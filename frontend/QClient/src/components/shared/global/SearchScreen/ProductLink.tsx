import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { Product } from "src/api/types/Product";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import logger from "src/constants/logger";
import RemoteImage from "../../generic/RemoteImage";
import { Feather } from "@expo/vector-icons";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "SearchScreen">;

type ProductLinkProps = {
  product: Product;
};

export default function ProductLink({ product }: ProductLinkProps) {
  logger.render("ProductLink");

  const navigation = useNavigation<NavigationProps>();

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
      <RemoteImage imageName={product.imageName} imageVersion={product.imageVersion} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
          {product.subtitle}
        </Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {product.description}
        </Text>
      </View>
      <UFeather style={styles.icon} name="arrow-right" size={24} />
    </TouchableOpacity>
  );
}

const UFeather = withUnistyles(Feather, (theme) => ({
  color: theme.text.onAccent,
}));

const styles = StyleSheet.create((theme) => ({
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    minWidth: "100%",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    backgroundColor: theme.background.card,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
    color: theme.text.primary,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    flexShrink: 1,
    color: theme.text.primary,
  },
  description: {
    fontSize: 12,
    fontWeight: "400",
    flexShrink: 1,
    color: theme.text.secondary,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  icon: {
    marginLeft: "auto",
    color: theme.text.primary,
  },
}));
