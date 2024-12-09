import { Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/useGlobalContext";
import { useRouter } from "expo-router";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { images } from "../../constants";
import api from "../../api";
import { useQuery } from "react-query";
import OptionList from "../../components/menu/OptionList";

export default function Product() {
  const router = useRouter();
  const { gProduct: product, gSetProduct } = useGlobalContext();

  const productQuery = useQuery({
    queryFn: () => api.fetchProductWithOptions(product.id),
    queryKey: ["product", product.id],
    onSuccess: (data) => {
      gSetProduct(data);
    },
  });

  if (productQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => router.back()}>
        <GoBackButtonSVG width={38} height={38} />
      </TouchableOpacity>
      <Text>{product.name}</Text>
      <Text>{product.subtitle}</Text>
      <Text>{product.description}</Text>
      <Text>{product.price.toFixed(2)} lei</Text>
      <Image
        source={product.image ? product.image : images.pizzaDemo}
        className="w-64 h-64"
      ></Image>
      {product.optionLists?.map((optionList) => (
        <OptionList key={optionList.id.toString()} optionList={optionList} />
      ))}
    </SafeAreaView>
  );
}
