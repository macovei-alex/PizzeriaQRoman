import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionList from "@/components/menu/product/OptionListCard";
import useColorTheme from "@/hooks/useColorTheme";
import HorizontalLine from "@/components/menu/product/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "@/components/menu/product/TitleSection";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useCartContext } from "@/context/useCartContext";
import useSingleImage from "@/hooks/useSingleImage";
import useProductWithOptionsQuery from "@/hooks/useProductWithOptionsQuery";
import { showToast } from "@/utils/toast";
import { ProductWithOptions } from "@/api/types/Product";
import logger from "@/utils/logger";

export default function ProductScreen() {
  logger.render("ProductScreen");

  const { productId, imageName } = useLocalSearchParams() as { productId: string; imageName: string };
  const { addToCart } = useCartContext();
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
            onPress={() => {
              showToast("Produs adăugat in coș");
              addToCart(product, 1);
            }}
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
