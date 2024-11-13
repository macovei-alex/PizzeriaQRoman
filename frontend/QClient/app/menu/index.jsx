import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuCategory from "../../components/menu/MenuCategory";
import { images } from "../../constants";
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

const MENU_PRODUCTS = [
  {
    id: 1,
    name: "Pizza Taraneasca",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 30,
    image: images.pizzaDemo,
    categoryId: 1,
  },
  {
    id: 2,
    name: "Pizza Margherita",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 40,
    image: images.pizzaDemo,
    categoryId: 1,
  },
  {
    id: 3,
    name: "Pizza Quattro Stagioni",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 50,
    image: images.pizzaDemo,
    categoryId: 2,
  },
  {
    id: 4,
    name: "Pizza Capriciosa",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 60,
    image: images.pizzaDemo,
    categoryId: 2,
  },
  {
    id: 5,
    name: "Pizza Quattro Formaggi",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 70,
    image: images.pizzaDemo,
    categoryId: 3,
  },
];

const MENU_CATEGORIES = [
  {
    id: 1,
    name: "Cele mai vândute",
  },
  {
    id: 2,
    name: "Pizza 1+1 combo",
  },
  {
    id: 3,
    name: "Pizza 30cm",
  },
  {
    id: 4,
    name: "Fă-ți singur pizza",
  },
  {
    id: 5,
    name: "Băuturi non-alcoolice",
  },
];

export default function Menu() {
  const router = useRouter();
  const { gSetProduct } = useGlobalContext();
  const [productsPerCategroy, setProductsPerCategory] = useState([
    { category: { id: 1 }, products: [] },
  ]);
  const { scrollRef, scrollToPos } = useScrollRef();
  const [categoryPositions, setCategoryPositions] = useState({});

  // Save the position of each category for the scroll to position from the horizontal menu
  const updateCategoryLayoutPositions = (categoryId, event) => {
    setCategoryPositions((prevPositions) => ({
      ...prevPositions,
      [categoryId]: event.nativeEvent.layout.y,
    }));
  };

  // Split products by category
  useEffect(() => {
    const productsSplit = [];
    for (let i = 0; i < MENU_CATEGORIES.length; i++) {
      productsSplit.push({
        category: MENU_CATEGORIES[i],
        products: [],
      });
      for (let j = 0; j < MENU_PRODUCTS.length; j++) {
        if (MENU_PRODUCTS[j].categoryId === MENU_CATEGORIES[i].id) {
          productsSplit[i].products.push(MENU_PRODUCTS[j]);
        }
      }
    }
    setProductsPerCategory(productsSplit);
  }, []);

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
              <View className="rounded-lg opacity-80 bg-bg-300">
                <Text className="px-4 py-1 font-bold">
                  Comanda minimă este de 40 RON
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Horizontal menu categories */}
        <ScrollView horizontal className="flex-row py-2">
          {MENU_CATEGORIES.map((category) => (
            <MenuCategory
              key={category.id}
              category={category}
              onPress={() => scrollToPos({ y: categoryPositions[category.id] })}
            />
          ))}
        </ScrollView>

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
