import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionList from "src/components/shared/ProductScreen/OptionListCard";
import useColorTheme from "src/hooks/useColorTheme";
import HorizontalLine from "src/components/shared/generic/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "src/components/shared/ProductScreen/TitleSection";
import { useCartContext } from "src/context/CartContext/CartContext";
import useProductWithOptionsQuery from "src/api/hooks/queries/useProductWithOptionsQuery";
import logger from "src/utils/logger";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { MenuStackParamList } from "src/navigation/MenuStackNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import { CartItemOptions } from "src/context/CartContext/types";

type RouteProps =
  | RouteProp<MenuStackParamList, "ProductScreen">
  | RouteProp<CartStackParamList, "ProductScreen">;

export default function ProductScreen() {
  logger.render("ProductScreen");

  const colorTheme = useColorTheme();
  const { cart, addCartItem, changeCartItemOptions } = useCartContext();
  const route = useRoute<RouteProps>();
  const productId = route.params.productId;
  const cartItemId = "cartItemId" in route.params ? route.params.cartItemId : null;
  const cartItem = cartItemId ? cart.find((item) => item.id === cartItemId) : null;
  if (!!cartItemId && !cartItem) throw new Error(`Cart item not found for id ( ${cartItemId} )`);

  const productQuery = useProductWithOptionsQuery(productId);
  const [cartItemOptions, setCartItemOptions] = useState<CartItemOptions>(cartItem?.options ?? {});

  if (productQuery.isFetching) return <ScreenActivityIndicator />;
  if (productQuery.isError) return <ErrorComponent />;
  if (!productQuery.data) throw new Error("Product not found");

  const product = productQuery.data;

  return (
    <SafeAreaView>
      <ScrollView>
        <TitleSection product={product} />

        {product.optionLists?.map((optionList) => (
          <Fragment key={optionList.id}>
            <HorizontalLine style={[styles.horizontalLine, { backgroundColor: colorTheme.text.secondary }]} />
            <OptionList
              optionList={optionList}
              currentOptions={cartItemOptions[optionList.id] || {}}
              setCartItemOptions={setCartItemOptions}
            />
          </Fragment>
        ))}

        <View style={styles.addToCartButtonContainer}>
          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: colorTheme.background.accent }]}
            onPress={() => {
              if (!cartItemId) {
                addCartItem(product, cartItemOptions);
              } else {
                changeCartItemOptions(cartItemId, cartItemOptions);
              }
            }}
          >
            <Text style={[styles.addToCartButtonText, { color: colorTheme.text.onAccent }]}>
              {!cartItem ? "Adaugă în coș" : "Actualizează coșul"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  horizontalLine: {
    marginVertical: 24,
    width: "95%",
  },
  addToCartButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  addToCartButton: {
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 24,
  },
  addToCartButtonText: {
    fontSize: 22,
  },
});
