import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionList from "@/components/menu/product/OptionListCard";
import useColorTheme from "@/hooks/useColorTheme";
import HorizontalLine from "@/components/menu/product/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "@/components/menu/product/TitleSection";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { CartItemOptions, useCartContext } from "@/context/useCartContext";
import useSingleImage from "@/hooks/useSingleImage";
import useProductWithOptionsQuery from "@/hooks/useProductWithOptionsQuery";
import { showToast } from "@/utils/toast";
import { OptionId, OptionListId, ProductWithOptions } from "@/api/types/Product";
import logger from "@/utils/logger";
import { useFocusEffect } from "expo-router";
import { deepEquals } from "@/utils/utils";

type ProductSearchParams = {
  productId: string;
  imageName: string;
  cartItemId: string;
};

export default function ProductScreen() {
  logger.render("ProductScreen");

  const params = useLocalSearchParams() as ProductSearchParams;
  if ((!params.productId || !params.imageName) && !params.cartItemId) {
    throw new Error(
      `Missing required search params. Expected {productId, imageName} or {cartItemId}, but got ${JSON.stringify(params)} instead`
    );
  }

  const { productId, imageName, cartItemId } = params;
  const colorTheme = useColorTheme();
  const { cart, addCartItem, changeCartItemOptions } = useCartContext();

  const cartItem = cart.find((item) => item.id === Number(cartItemId));
  if (cartItemId && !cartItem) {
    throw new Error(`Cart item not found: ${cartItemId}`);
  }

  const productQuery = useProductWithOptionsQuery(Number(cartItem?.product.id ?? productId));
  const image = useSingleImage(cartItem?.product.imageName ?? imageName);
  const [cartItemOptions, setCartItemOptions] = useState<CartItemOptions>(cartItem?.options ?? {});

  // Update the cached UI state. Prevents a bug where pressing a cart item, then the cart icon
  // and then another product doesn't reload the UI with the correct options.
  const handleScreenFocus = useCallback(() => {
    console.log("focus");
    if (cartItem) {
      setCartItemOptions(() => cartItem.options);
    }
  }, [cartItem]);

  // Update the cart item options only when the screen is blurred for performance reasons
  // since the cart is in a context.
  const handleScreenBlur = useCallback(() => {
    console.log("blur");
    if (!cartItem) {
      return;
    }
    if (deepEquals(cartItem.options, cartItemOptions)) {
      return;
    }
    showToast("Opțiuni actualizate");
    changeCartItemOptions(cartItem.id, cartItemOptions);
  }, [cartItem, cartItemOptions, changeCartItemOptions]);

  // useFocusEffect(
  //   useCallback(() => {
  //     handleScreenFocus();
  //     return handleScreenBlur;
  //   }, [handleScreenFocus, handleScreenBlur])
  // );

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
      const newOptionCounts = { ...prev[optionListId], [optionId]: newCount };
      if (newCount === 0) {
        delete newOptionCounts[optionId];
      }
      const newOptions = { ...prev, [optionListId]: newOptionCounts };
      if (Object.keys(newOptionCounts).length === 0) {
        delete newOptions[optionListId];
      }

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
