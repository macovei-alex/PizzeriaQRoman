import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View, Animated } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { Product } from "src/api/types/Product";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import logger from "src/constants/logger";
import RemoteImage from "../../generic/RemoteImage";
import { Feather } from "@expo/vector-icons";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "SearchScreen">;

type ProductLinkProps = {
  product: Product;
  index: number;
};

export default function ProductLink({ product, index }: ProductLinkProps) {
  logger.render("ProductLink");

  const navigation = useNavigation<NavigationProps>();
  const translateYRef = useRef(new Animated.Value(-20));
  const opacityRef = useRef(new Animated.Value(0));

  useEffect(() => {
    const translateY = translateYRef.current;
    const opacity = opacityRef.current;

    const animation = Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        stiffness: 100,
        damping: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    const timeout = setTimeout(() => {
      animation.start();
    }, index * 100);

    return () => {
      clearTimeout(timeout);
      translateY.resetAnimation();
      translateY.setValue(-20);
      opacity.resetAnimation();
      opacity.setValue(0);
    };
  }, [product.id, index]);

  return (
    <Animated.View
      style={{ transform: [{ translateY: translateYRef.current }], opacity: opacityRef.current }}
    >
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
    </Animated.View>
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
