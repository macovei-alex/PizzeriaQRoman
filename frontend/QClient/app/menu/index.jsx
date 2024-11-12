import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuOption from "../../components/menu/MenuOption";
import MenuCategory from "../../components/menu/MenuCategory";
import { images } from "../../constants";
import { Image, ImageBackground, ScrollView, Text, View } from "react-native";

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

const Menu = () => {
  const [productsPerCategroy, setProductsPerCategory] = useState([
    { category: "", products: [] },
  ]);

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
      <ScrollView>
        <View>
          <ImageBackground
            source={images.menuBackground}
            className="w-full h-44"
          >
            <View className="flex items-center justify-center h-full">
              {/* TODO: rounded image corners */}
              <Image
                source={images.logo}
                className="w-64"
                resizeMode="contain"
              />
              <View className="rounded-lg opacity-80 bg-bg-300">
                <Text className="px-4 py-1 font-bold">
                  Comanda minimă este de 40 RON
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <ScrollView horizontal className="flex-row mt-2">
          {MENU_CATEGORIES.map((category) => (
            <MenuCategory key={category.name} name={category.name} />
          ))}
        </ScrollView>

        <View className="mb-3">
          {productsPerCategroy.map(({ category, products }) => (
            <View className="pt-4">
              <View className="ml-6">
                <Text className="text-xl font-extrabold">{category.name}</Text>
              </View>
              {products.map((product) => (
                <MenuOption key={product.id} product={product} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Menu;
