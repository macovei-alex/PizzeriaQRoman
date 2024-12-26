import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/useGlobalContext";
import { router } from "expo-router";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { images } from "../../constants";
import api from "../../api";
import { useQuery } from "react-query";
import OptionList from "../../components/menu/OptionList";

export default function Product() {
  const { gProduct } = useGlobalContext();

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
      <TouchableOpacity onPress={() => router.back()}>
        <GoBackButtonSVG style={styles.goBackSvg} />
      </TouchableOpacity>
      <Text>{product.name}</Text>
      <Text>{product.subtitle}</Text>
      <Text>{product.description}</Text>
      <Text>{product.price.toFixed(2)} lei</Text>
      <Image source={product.image ? product.image : images.pizzaDemo} style={styles.image}></Image>
      {product.optionLists?.map((optionList) => (
        <OptionList key={optionList.id.toString()} optionList={optionList} />
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 256,
    height: 256,
  },
  goBackSvg: {
    width: 38,
    height: 38,
  },
});
