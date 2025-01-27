import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "../../hooks/useColorTheme";
import HorizontalLine from "../../components/menu/product/HorizontalLine";
import React from "react";
import ProductSection from "../../components/cart/index/ProductSection";
import TitleSection from "../../components/cart/index/TitleSection";

export default function Cart() {
  const colorTheme = useColorTheme();

  return (
    <SafeAreaView>
      <ScrollView>
        <TitleSection />

        <ProductSection />

        <View style={styles.sendOrderContainer}>
          <TouchableOpacity style={[styles.sendOrderButton, { backgroundColor: colorTheme.background[500] }]}>
            <Text style={[styles.sendOrderText, { color: colorTheme.text[300] }]}>Trimite comanda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sendOrderContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  sendOrderButton: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 18,
  },
  sendOrderText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
