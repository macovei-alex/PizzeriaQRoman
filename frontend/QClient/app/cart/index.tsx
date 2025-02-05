import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "@/hooks/useColorTheme";
import ProductSection from "@/components/cart/index/ProductSection";
import TitleSection from "@/components/cart/index/TitleSection";
import api from "@/api";
import { useCartContext } from "@/context/useCartContext";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";
import { PlacedOrder } from "@/api/types/Order";
import logger from "@/utils/logger";

export default function Cart() {
  logger.render("Cart");

  const colorTheme = useColorTheme();
  const { cart } = useCartContext();

  const [sendingOrder, setSendingOrder] = useState(false);

  function sendOrder() {
    if (cart.length === 0) {
      showToast("Coșul este gol");
      router.push("/cart/confirmation");
      return;
    }

    setSendingOrder(() => true);

    const order: PlacedOrder = {
      items: cart.map((cartItem) => ({ productId: cartItem.product.id, count: cartItem.count })),
      additionalNotes: null,
    };

    api
      .sendOrder(order)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          logger.log("Order sent successfully");
        }
      })
      .catch((error) => {
        logger.error("Error sending order:", error.response.data);
      })
      .finally(() => {
        setSendingOrder(() => false);
        router.push("/cart/confirmation");
      });
  }

  return (
    <SafeAreaView>
      {!sendingOrder ? (
        <ScrollView>
          <TitleSection />

          <ProductSection />

          <View style={styles.sendOrderContainer}>
            <TouchableOpacity
              style={[styles.sendOrderButton, { backgroundColor: colorTheme.background[500] }]}
              onPress={sendOrder}
            >
              <Text style={[styles.sendOrderText, { color: colorTheme.text[300] }]}>Trimite comanda</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sendOrderContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  sendOrderButton: {
    paddingHorizontal: 52,
    paddingVertical: 12,
    borderRadius: 18,
  },
  sendOrderText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
