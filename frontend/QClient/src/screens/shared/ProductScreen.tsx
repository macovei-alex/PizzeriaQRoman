import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionList from "src/components/shared/ProductScreen/OptionListCard";
import useColorTheme from "src/hooks/useColorTheme";
import HorizontalLine from "src/components/shared/ProductScreen/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "src/components/shared/ProductScreen/TitleSection";
import { CartItemOptions, useCartContext } from "src/context/useCartContext";
import useSingleImage from "src/hooks/useSingleImage";
import useProductWithOptionsQuery from "src/hooks/useProductWithOptionsQuery";
import { showToast } from "src/utils/toast";
import { OptionId, OptionListId, ProductWithOptions } from "src/api/types/Product";
import logger from "src/utils/logger";
import { jsonEquals } from "src/utils/utils";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { MenuStackParamList } from "src/navigation/MenuStackNavigator";
import { RouteProp } from "@react-navigation/native";

type ProductScreenProps = {
  route: RouteProp<MenuStackParamList, "ProductScreen"> | RouteProp<CartStackParamList, "ProductScreen">;
};

export default function ProductScreen({ route }: ProductScreenProps) {
  logger.render("ProductScreen");

  const productId = route.params.productId;
  const imageName = route.params.imageName;
  const cartItemId = "cartItemId" in route.params ? route.params.cartItemId : null;

  const colorTheme = useColorTheme();
  const { cart, addCartItem, changeCartItemOptions } = useCartContext();

  const cartItem = cart.find((item) => item.id === Number(cartItemId));
  if (cartItemId && !cartItem) {
    throw new Error(`Cart item not found for id ( ${cartItemId} )`);
  }

  const productQuery = useProductWithOptionsQuery(Number(productId));
  const image = useSingleImage(imageName);
  const [cartItemOptions, setCartItemOptions] = useState<CartItemOptions>(cartItem?.options ?? {});

  // Update the cached UI state. Prevents a bug where pressing a cart item, then the cart icon
  // and then another product doesn't reload the UI with the correct options.
  // const handleScreenFocus = useCallback(() => {
  //   console.log("focus");
  //   if (cartItem) {
  //     setCartItemOptions(() => cartItem.options);
  //   }
  // }, [cartItem]);

  // Update the cart item options only when the screen is blurred for performance reasons
  // since the cart is in a context.
  // const handleScreenBlur = useCallback(() => {
  //   console.log("blur");
  //   if (!cartItem) {
  //     return;
  //   }
  //   if (deepEquals(cartItem.options, cartItemOptions)) {
  //     return;
  //   }
  //   showToast("Opțiuni actualizate");
  //   changeCartItemOptions(cartItem.id, cartItemOptions);
  // }, [cartItem, cartItemOptions, changeCartItemOptions]);

  // Update the cached UI state. Prevents a bug where pressing a cart item, then the cart icon
  // and then another product doesn't refresh the UI state with the correct options.
  useEffect(() => {
    if (cartItem && !jsonEquals(cartItem.options, cartItemOptions)) {
      setCartItemOptions(() => cartItem.options);
    }
  }, [cartItem, cartItemOptions]);

  if (productQuery.isLoading || !image) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }

  const product = productQuery.data as ProductWithOptions;

  function handleOptionChange(optionListId: OptionListId, optionId: OptionId, newCount: number) {
    const optionList = product.optionLists.find((optionList) => optionList.id === optionListId);
    if (!optionList) {
      throw new Error(`Option list not found: ${optionListId}`);
    }
    const option = optionList.options.find((option) => option.id === optionId);
    if (!option) {
      throw new Error(`Option not found: ${optionId}`);
    }

    if (newCount < 0 || newCount > option.maxCount) {
      throw new Error(`Invalid option count: ${newCount}`);
    }

    const choiceCount = Object.values(cartItemOptions[optionListId] || {}).reduce(
      (acc, count) => acc + (count !== 0 ? 1 : 0),
      0
    );
    if (choiceCount === optionList.maxChoices && (cartItemOptions[optionListId][optionId] ?? 0) === 0) {
      showToast(`Poți alege maxim ${optionList.maxChoices} opțiuni din această listă`);
      return;
    }

    setCartItemOptions((prev) => {
      if (!!prev[optionListId] && newCount === prev[optionListId][optionId]) {
        return prev;
      }
      const newOptionCounts = { ...prev[optionListId], [optionId]: newCount };
      if (newCount === 0) {
        delete newOptionCounts[optionId];
      }
      const newOptions = { ...prev, [optionListId]: newOptionCounts };
      if (Object.keys(newOptionCounts).length === 0) {
        delete newOptions[optionListId];
      }

      // TODO: Improve performance by not refreshing the cart every time.
      if (cartItem) {
        changeCartItemOptions(Number(cartItem.id), newOptions);
      }

      return newOptions;
    });
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <TitleSection product={product} productImage={image} />

        {product.optionLists?.map((optionList) => (
          <Fragment key={optionList.id}>
            <HorizontalLine style={[styles.horizontalLine, { backgroundColor: colorTheme.text.secondary }]} />
            <OptionList
              optionList={optionList}
              currentOptionCounts={cartItemOptions[optionList.id] || {}}
              onOptionChange={handleOptionChange}
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
