import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionList from "src/components/shared/ProductScreen/OptionListCard";
import useColorTheme from "src/hooks/useColorTheme";
import HorizontalLine from "src/components/shared/ProductScreen/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "src/components/shared/ProductScreen/TitleSection";
import { CartItemOptions, useCartContext } from "src/context/CartContext";
import useSingleImage from "src/hooks/useSingleImage";
import useProductWithOptionsQuery from "src/api/hooks/useProductWithOptionsQuery";
import { ProductWithOptions } from "src/api/types/Product";
import logger from "src/utils/logger";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { MenuStackParamList } from "src/navigation/MenuStackNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";
import equal from "fast-deep-equal";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";

type RouteProps =
  | RouteProp<MenuStackParamList, "ProductScreen">
  | RouteProp<CartStackParamList, "ProductScreen">;

export default function ProductScreen() {
  logger.render("ProductScreen");

  const route = useRoute<RouteProps>();
  const productId = route.params.productId;
  const imageName = route.params.imageName;
  const cartItemId = "cartItemId" in route.params ? route.params.cartItemId : null;

  const colorTheme = useColorTheme();
  const { cart, addCartItem, changeCartItemOptions } = useCartContext();

  const cartItem = cart.find((item) => item.id === Number(cartItemId));
  if (cartItemId && !cartItem) throw new Error(`Cart item not found for id ( ${cartItemId} )`);

  const productQuery = useProductWithOptionsQuery(Number(productId));
  const image = useSingleImage(imageName);
  const [cartItemOptions, setCartItemOptions] = useState<CartItemOptions>(cartItem?.options ?? {});

  useEffect(() => {
    if (cartItem && !equal(cartItem.options, cartItemOptions)) {
      changeCartItemOptions(cartItem.id, cartItemOptions);
    }
  }, [cartItem, cartItemOptions, changeCartItemOptions]);

  const product = useMemo(() => productQuery.data as ProductWithOptions, [productQuery.data]);

  if (productQuery.isLoading || !image) return <ScreenActivityIndicator text="" />;
  if (productQuery.isError) return <ErrorComponent onRetry={productQuery.refetch} />;

  return (
    <SafeAreaView>
      <ScrollView>
        <TitleSection product={product} productImage={image} />

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
            onPress={() => addCartItem(product, cartItemOptions)}
          >
            <Text style={[styles.addToCartButtonText, { color: colorTheme.text.onAccent }]}>
              Adaugă în coș
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
