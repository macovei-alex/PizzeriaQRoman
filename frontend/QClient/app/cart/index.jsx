import { SafeAreaView } from "react-native-safe-area-context";
import { useCartContext } from "../../context/useCartContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CartItem from "../../components/cart/index/CartItem";
import { useColorTheme } from "../../hooks/useColorTheme";
import HorizontalLine from "../../components/menu/product/HorizontalLine";
import React from "react";

export default function Cart() {
  const { cart } = useCartContext();
  const colorTheme = useColorTheme();

  const totalPrice = cart.reduce((total, cartItem) => total + cartItem.product.price * cartItem.count, 0);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: colorTheme.text[100] }]}>Comanda mea</Text>
        </View>
        <HorizontalLine style={styles.hr} />
        {cart.map((cartItem) => (
          <CartItem key={cartItem.product.id} cartItem={cartItem} />
        ))}
        <View style={styles.totalPriceContainerContainer}>
          <View style={[styles.totalPriceContainer, { backgroundColor: colorTheme.background[500] }]}>
            <Text style={[styles.totalPriceText, { color: colorTheme.text[300] }]}>
              Total de plată: {totalPrice.toFixed(2)} RON
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "500",
  },
  hr: {
    height: 3,
    marginBottom: 20,
  },
  totalPriceContainerContainer: {
    alignItems: "center",
  },
  totalPriceContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 18,
  },
  totalPriceText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
