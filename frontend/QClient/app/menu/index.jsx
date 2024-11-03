import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuOption from "./components/MenuOption";
import { images } from "../../constants";
import { ScrollView } from "react-native";

const menuOptions = [
  {
    id: 1,
    name: "Pizza Taraneasca",
    description: "1+1 Gratis la alegere",
    price: 30,
    image: images.pizzaDemo,
  },
  {
    id: 2,
    name: "Pizza Margherita",
    description: "1+1 Gratis la alegere",
    price: 40,
    image: images.pizzaDemo,
  },
  {
    id: 3,
    name: "Pizza Quattro Stagioni",
    description: "1+1 Gratis la alegere",
    price: 50,
    image: images.pizzaDemo,
  },
  {
    id: 4,
    name: "Pizza Capriciosa",
    description: "1+1 Gratis la alegere",
    price: 60,
    image: images.pizzaDemo,
  },
  {
    id: 5,
    name: "Pizza Quattro Formaggi",
    description: "1+1 Gratis la alegere",
    price: 70,
    image: images.pizzaDemo,
  },
];

const Menu = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        {menuOptions.map((option) => (
          <MenuOption
            key={option.id}
            name={option.name}
            description={option.description}
            price={option.price}
            image={option.image}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Menu;
