import React, { useState } from "react";
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
import { OptionId, OptionListId, ProductWithOptions } from "@/api/types/Product";
import logger from "@/utils/logger";

export default function ProductScreen() {
  logger.render("ProductScreen");

  const colorTheme = useColorTheme();
  const { productId, imageName } = useLocalSearchParams() as { productId: string; imageName: string };
  const { addToCart } = useCartContext();
  const productQuery = useProductWithOptionsQuery(Number(productId));
  const image = useSingleImage(imageName);
  const [optionCounts, setOptionCounts] = useState<Record<OptionListId, Record<OptionId, number>>>({});

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

    const choiceCount = Object.values(optionCounts[optionListId] || {}).reduce(
      (acc, count) => acc + (count !== 0 ? 1 : 0),
      0
    );
    if (choiceCount === optionList.maxChoices && (optionCounts[optionListId][optionId] ?? 0) === 0) {
      showToast(`Poți alege maxim ${optionList.maxChoices} opțiuni din această listă`);
      return;
    }

    setOptionCounts((prev) => {
      const newOptionCounts = { ...prev[optionListId], [optionId]: newCount };
      return { ...prev, [optionListId]: newOptionCounts };
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
              currentOptionCounts={optionCounts[optionList.id] || {}}
              onOptionChange={handleOptionChange}
            />
          </Fragment>
        ))}

        <View style={styles.addToCartButtonContainer}>
          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: colorTheme.background.accent }]}
            onPress={() => {
              showToast("Produs adăugat in coș");
              addToCart(product, 1);
            }}
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
