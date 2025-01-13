import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/useGlobalContext";
import api from "../../api";
import { useQuery } from "react-query";
import OptionList from "../../components/menu/product/OptionList";
import { useColorTheme } from "../../hooks/useColorTheme";
import HorizontalLine from "../../components/menu/product/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "../../components/menu/product/TitleSection";
import useSingleDiskImage from "../../hooks/useSingleDiskImage";
import { useLocalSearchParams } from "expo-router/build/hooks";

export default function Product() {
  const { productId, imageName } = useLocalSearchParams();
  const colorTheme = useColorTheme();
  const imageQuery = useSingleDiskImage(imageName);

  const productQuery = useQuery({
    queryFn: () => api.fetchProductWithOptions(productId),
    queryKey: ["product", productId],
  });

  if (productQuery.isLoading || imageQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }
  if (imageQuery.isError) {
    return <Text>Error: {imageQuery.error.message}</Text>;
  }

  const product = productQuery.data;
  const image = imageQuery.data;

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
            onPress={() => {}}
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
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  addToCartButtonText: {
    fontSize: 22,
  },
});
