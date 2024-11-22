import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuCategory from "../../components/menu/MenuCategory";
import { images, BASE_API_URL } from "../../constants";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/useGlobalContext";
import MenuProduct from "../../components/menu/MenuProduct";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";
import { useScrollRef } from "../../hooks/useScrollRef";
import SearchBar from "../../components/menu/SerachBar";
import { useQuery } from "react-query";

export default function Menu() {
  const router = useRouter();
  const { gSetProduct } = useGlobalContext();
  const [productsPerCategroy, setProductsPerCategory] = useState([
    { category: { id: 1 }, products: [] },
  ]);
  const { scrollRef, scrollToPos } = useScrollRef();
  const [categoryPositions, setCategoryPositions] = useState({});

  const products = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(`${BASE_API_URL}/mock/product/all`);
      return response.json();
    },
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(`${BASE_API_URL}/mock/category/all`);
      return response.json();
    },
  });

  // Save the position of each category for the scroll to position from the horizontal menu
  const updateCategoryLayoutPositions = (categoryId, event) => {
    // Extracting data in layout is a MUST because the event is a synthetic event (event pooling)
    // and event.nativeEvent will be set to null afterwards.
    const { layout } = event.nativeEvent;
    setCategoryPositions((prevPositions) => ({
      ...prevPositions,
      [categoryId]: layout.y,
    }));
  };

  // Split products by category
  useEffect(() => {
    if (
      products.isLoading ||
      products.isError ||
      !products.data ||
      categories.isLoading ||
      categories.isError ||
      !categories.data
    )
      return;

    const productsSplit = [];
    for (let i = 0; i < categories.data.length; i++) {
      productsSplit.push({
        category: categories.data[i],
        products: [],
      });
      for (let j = 0; j < products.data.length; j++) {
        if (products.data[j].categoryId === categories.data[i].id) {
          productsSplit[i].products.push(products.data[j]);
        }
      }
    }
    setProductsPerCategory(productsSplit);
  }, [products.data, categories.data]);

  if (products.isLoading || categories.isLoading)
    return <Text>Loading...</Text>;
  if (products.isError) return <Text>Error: {products.error.message}</Text>;
  if (categories.isError) return <Text>Error: {categories.error.message}</Text>;

  return (
    <SafeAreaView>
      <ScrollView ref={scrollRef}>
        {/* Logo section */}
        <View>
          <ImageBackground
            source={images.menuBackground}
            className="w-full h-44"
          >
            <View className="absolute">
              <TouchableOpacity onPress={router.back} className="mt-4 ml-1">
                <GoBackButtonSVG width={38} height={38} />
              </TouchableOpacity>
            </View>
            <View className="flex items-center justify-around h-full py-2">
              <Image
                source={images.logo}
                className="h-20 w-44 rounded-xl"
                resizeMode="stretch"
              />
              <View className="rounded-lg opacity-75 bg-bg-300">
                <Text className="px-4 py-1 font-bold">
                  Comanda minimă este de 40 RON
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Horizontal menu categories */}
        <ScrollView horizontal className="flex-row py-2">
          {categories.data.map((category) => (
            <MenuCategory
              key={category.id}
              category={category}
              onPress={() => scrollToPos({ y: categoryPositions[category.id] })}
            />
          ))}
        </ScrollView>

        <SearchBar
          placeholder={"Caută ce îți dorești"}
          onSearch={(text) => {
            console.log(`"${text}"`);
          }}
        />

        {/* Product list */}
        <View>
          {productsPerCategroy.map(({ category, products }) => (
            <View
              key={category.id}
              onLayout={(event) => {
                // Save the position of each category for the scroll to position from the horizontal menu
                updateCategoryLayoutPositions(category.id, event);
              }}
              className="my-2"
            >
              <View className="ml-6">
                <Text className="text-xl font-extrabold">{category.name}</Text>
              </View>
              {products.map((product) => (
                <MenuProduct
                  key={product.id}
                  product={product}
                  onClick={() => {
                    gSetProduct(product);
                    router.push("/menu/product");
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
