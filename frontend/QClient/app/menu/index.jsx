import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuOption from "../../components/menu/MenuOption";
import MenuCategory from "../../components/menu/MenuCategory";
import { images } from "../../constants";
import { Image, ImageBackground, ScrollView, Text, View } from "react-native";

const MENU_OPTIONS = [
  {
    id: 1,
    name: "Pizza Taraneasca",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 30,
    image: images.pizzaDemo,
  },
  {
    id: 2,
    name: "Pizza Margherita",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 40,
    image: images.pizzaDemo,
  },
  {
    id: 3,
    name: "Pizza Quattro Stagioni",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 50,
    image: images.pizzaDemo,
  },
  {
    id: 4,
    name: "Pizza Capriciosa",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 60,
    image: images.pizzaDemo,
  },
  {
    id: 5,
    name: "Pizza Quattro Formaggi",
    subtitle: "1+1 Gratis la alegere",
    description: "500g",
    price: 70,
    image: images.pizzaDemo,
  },
];

const CATEGORIES = [
  {
    name: "Cele mai vândute",
  },
  {
    name: "Pizza 1+1 combo",
  },
  {
    name: "Pizza 30cm",
  },
  {
    name: "Fă-ți singur pizza",
  },
  {
    name: "Băuturi non-alcoolice",
  },
];

const Menu = () => {
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
          {CATEGORIES.map((category) => (
            <MenuCategory key={category.name} name={category.name} />
          ))}
        </ScrollView>

        {MENU_OPTIONS.map((option) => (
          <MenuOption key={option.id} product={option} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Menu;
