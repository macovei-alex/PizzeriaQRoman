import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "@/hooks/useColorTheme";
import ProductSection from "@/components/cart/CartScreen/ProductSection";
import TitleSection from "@/components/cart/CartScreen/TitleSection";
import api from "@/api";
import { useCartContext } from "@/context/useCartContext";
import { showToast } from "@/utils/toast";
import { PlacedOrder } from "@/api/types/Order";
import logger from "@/utils/logger";
import { convertCartItemOptions } from "@/utils/convertions";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

export default function CartScreen() {
  logger.render("Cart");

  const navigation = useNavigation();
  const colorTheme = useColorTheme();
  const { cart, emptyCart } = useCartContext();
  const queryClient = useQueryClient();

  const [sendingOrder, setSendingOrder] = useState(false);

  function sendOrder() {
    if (cart.length === 0) {
      showToast("Coșul este gol");
      return;
    }

    setSendingOrder(() => true);

    const order: PlacedOrder = {
      items: cart.map((cartItem) => ({
        productId: cartItem.product.id,
        count: cartItem.count,
        optionLists: convertCartItemOptions(cartItem.options),
      })),
      additionalNotes: null,
    };

    api
      .sendOrder(order)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          emptyCart();
          navigation.navigate("ConfirmationScreen");
        } else {
          logger.error("Error sending order:", res.data);
        }
        queryClient.invalidateQueries({ queryKey: ["order-history"] });
      })
      .catch((error) => {
        logger.error("Error sending order:", error.response.data);
      })
      .finally(() => {
        setSendingOrder(() => false);
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
              style={[styles.sendOrderButton, { backgroundColor: colorTheme.background.accent }]}
              onPress={sendOrder}
            >
              <Text style={[styles.sendOrderText, { color: colorTheme.text.onAccent }]}>Trimite comanda</Text>
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
