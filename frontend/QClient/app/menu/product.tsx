import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionList from "../../components/menu/product/OptionListCard";
import useColorTheme from "../../hooks/useColorTheme";
import HorizontalLine from "../../components/menu/product/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "../../components/menu/product/TitleSection";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { CartContextType, useCartContext } from "../../context/useCartContext";
import useSingleImage from "../../hooks/useSingleImage";
import React from "react";
import useProductWithOptionsQuery from "../../hooks/useProductWithOptionsQuery";
import { showToast } from "../../utils/toast";
import { ProductWithOptions } from "@/api/types/Product";

export default function ProductScreen() {
  const { productId, imageName } = useLocalSearchParams() as { productId: string; imageName: string };
  const { cart, setCart } = useCartContext() as CartContextType;
  const colorTheme = useColorTheme();
  const productQuery = useProductWithOptionsQuery(Number(productId));
  const image = useSingleImage(imageName);

  if (productQuery.isLoading || !image) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }

  const product = productQuery.data as ProductWithOptions;

  function addToCart() {
    showToast("Produs adăugat in coș");
    if (cart.find((item) => item.product.id === product.id)) {
      setCart([
        ...cart.map((item) =>
          item.product.id === product.id
            ? { id: item.id, product: item.product, count: item.count + 1 }
            : item
        ),
      ]);
    } else {
      setCart([...cart, { id: product.id, product: product, count: 1 }]);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <TitleSection product={product} productImage={image} />

        {product.optionLists?.map((optionList) => (
          <Fragment key={optionList.id}>
            <HorizontalLine style={[styles.horizontalLine, { backgroundColor: colorTheme.text[200] }]} />
            <OptionList optionList={optionList} />
          </Fragment>
        ))}

        <View style={styles.addToCartButtonContainer}>
          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: colorTheme.background[500] }]}
            onPress={addToCart}
          >
            <Text style={[styles.addToCartButtonText, { color: colorTheme.text[300] }]}>Adaugă în coș</Text>
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
