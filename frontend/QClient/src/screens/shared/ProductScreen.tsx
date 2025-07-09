import React, { useRef, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import OptionList from "src/components/shared/ProductScreen/OptionListCard";
import HorizontalLine from "src/components/shared/generic/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "src/components/shared/ProductScreen/TitleSection";
import { useCartContext } from "src/context/CartContext/CartContext";
import useProductWithOptionsQuery from "src/api/hooks/queries/useProductWithOptionsQuery";
import logger from "src/constants/logger";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { MenuStackParamList } from "src/navigation/MenuStackNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import { CartItemOptions } from "src/context/CartContext/types";
import MorphingButton from "src/components/shared/ProductScreen/MorphingButton";
import { showToast } from "src/utils/toast";

type RouteProps =
  | RouteProp<MenuStackParamList, "ProductScreen">
  | RouteProp<CartStackParamList, "ProductScreen">;

export default function ProductScreen() {
  logger.render("ProductScreen");

  const { cart, addCartItem, changeCartItemOptions } = useCartContext();
  const route = useRoute<RouteProps>();
  const productId = route.params.productId;
  const cartItemId = "cartItemId" in route.params ? route.params.cartItemId : null;
  const cartItem = cartItemId ? cart.find((item) => item.id === cartItemId) : null;
  if (!!cartItemId && !cartItem) throw new Error(`Cart item not found for id ( ${cartItemId} )`);

  const productQuery = useProductWithOptionsQuery(productId);
  const [cartItemOptions, setCartItemOptions] = useState<CartItemOptions>(cartItem?.options ?? {});

  const scrollYRef = useRef(0);
  const [visibleHeight, setVisibleHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  if (productQuery.isFetching) return <ScreenActivityIndicator />;
  if (productQuery.isError) return <ErrorComponent />;
  if (!productQuery.data) throw new Error("Product not found");

  const product = productQuery.data;

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={productQuery.isFetching} onRefresh={productQuery.refetch} />
        }
        contentContainerStyle={styles.scrollViewContent}
        onScroll={(e) => (scrollYRef.current = e.nativeEvent.contentOffset.y)}
        onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(_, h) => setContentHeight(h)}
      >
        <TitleSection product={product} />

        {product.optionLists.map((optionList) => (
          <Fragment key={optionList.id}>
            <UHorizontalLine style={styles.horizontalLine} />
            <OptionList
              optionList={optionList}
              currentOptions={cartItemOptions[optionList.id] || {}}
              setCartItemOptions={setCartItemOptions}
            />
          </Fragment>
        ))}
      </ScrollView>

      <MorphingButton
        text={!cartItem ? "Adaugă în coș" : "Actualizează coșul"}
        onPress={() => {
          if (!cartItemId) {
            addCartItem(product, cartItemOptions);
            showToast("Produs adăugat în coș");
          } else {
            changeCartItemOptions(cartItemId, cartItemOptions);
            showToast("Produs actualizat în coș");
          }
        }}
        scrollYRef={scrollYRef}
        visibleHeight={visibleHeight}
        contentHeight={contentHeight}
      />
    </>
  );
}

const UHorizontalLine = withUnistyles(HorizontalLine, (theme) => ({
  color: theme.text.secondary,
}));

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 80,
  },
  horizontalLine: {
    marginVertical: 24,
    width: "95%",
  },
  scrollBasedButtonStyle: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "green",
  },
});
