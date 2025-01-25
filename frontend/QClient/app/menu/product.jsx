import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { useQuery } from "react-query";
import OptionList from "../../components/menu/product/OptionList";
import { useColorTheme } from "../../hooks/useColorTheme";
import HorizontalLine from "../../components/menu/product/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "../../components/menu/product/TitleSection";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useCartContext } from "../../context/useCartContext";
import useSingleImage from "../../hooks/useSingleImage";
import Toast from "react-native-toast-message";
import { ToastAndroid } from "react-native";
import React from "react";

export default function Product() {
  const { productId, imageName } = useLocalSearchParams();
  const { cart, setCart } = useCartContext();
  const colorTheme = useColorTheme();

  const productQuery = useQuery({
    queryFn: () => api.fetchProductWithOptions(productId),
    queryKey: ["product", productId],
  });

  const image = useSingleImage(imageName);

  if (productQuery.isLoading || !image) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }

  const product = productQuery.data;

  function addToCart() {
    if (Platform.OS === "android") {
      ToastAndroid.show("Produs adăugat in coș", ToastAndroid.SHORT);
    } else if (Platform.OS === "ios") {
      // TODO: See if this works on iOS
      Toast.show({
        type: "info",
        text1: "Produs adăugat in coș",
      });
    }

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
