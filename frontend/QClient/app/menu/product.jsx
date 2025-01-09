import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/useGlobalContext";
import { router } from "expo-router";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { images } from "../../constants";
import api from "../../api";
import { useQuery } from "react-query";
import OptionList from "../../components/menu/product/OptionList";
import { useColorTheme } from "../../hooks/useColorTheme";
import HorizontalLine from "../../components/menu/product/HorizontalLine";
import { Fragment } from "react";
import TitleSection from "../../components/menu/product/TitleSection";

export default function Product() {
  const { gProduct } = useGlobalContext();
  const colorTheme = useColorTheme();

  const productQuery = useQuery({
    queryFn: () => api.fetchProductWithOptions(gProduct.id),
    queryKey: ["product", gProduct.id],
  });

  if (productQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }

  const product = productQuery.data;

  return (
    <SafeAreaView>
      <ScrollView>
        <TitleSection product={product} />

        {product.optionLists?.map((optionList) => (
          <Fragment key={optionList.id}>
            <HorizontalLine
              style={[styles.horizontalLine, { backgroundColor: colorTheme.background[200] }]}
            />
            <OptionList optionList={optionList} />
          </Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  horizontalLine: {
    marginVertical: 24,
    width: "95%",
  },
});
