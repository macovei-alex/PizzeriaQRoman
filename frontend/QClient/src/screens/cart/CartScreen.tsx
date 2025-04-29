import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import ProductSection from "src/components/cart/CartScreen/ProductSection";
import { useCartContext } from "src/context/CartContext";
import { showToast } from "src/utils/toast";
import { PlacedOrder } from "src/api/types/Order";
import logger from "src/utils/logger";
import { convertCartItemOptions } from "src/utils/convertions";
import { useQueryClient } from "@tanstack/react-query";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import ScreenTitle from "src/components/shared/ScreenTitle";
import { api } from "src/api";

type CartScreenProps = { navigation: NativeStackNavigationProp<CartStackParamList, "CartScreen"> };

export default function CartScreen({ navigation }: CartScreenProps) {
  logger.render("CartScreen");

  const colorTheme = useColorTheme();
  const { cart, emptyCart } = useCartContext();
  const queryClient = useQueryClient();

  const [sendingOrder, setSendingOrder] = useState(false);

  function sendOrder() {
    if (cart.length === 0) {
      showToast("Coșul este gol");
      return;
    }

    setSendingOrder(true);

    const order: PlacedOrder = {
      items: cart.map((cartItem) => ({
        productId: cartItem.product.id,
        count: cartItem.count,
        optionLists: convertCartItemOptions(cartItem.options),
      })),
      additionalNotes: null,
    };

    api.axios
      .post("/order/place", order)
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
        setSendingOrder(false);
      });
  }

  if (sendingOrder) {
    return <Text>Sending order...</Text>;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <ScreenTitle title={"Comanda mea"} containerStyle={styles.titleScreenContainer} />

        <ProductSection navigation={navigation} />

        <View style={styles.sendOrderContainer}>
          <TouchableOpacity
            style={[styles.sendOrderButton, { backgroundColor: colorTheme.background.accent }]}
            onPress={sendOrder}
          >
            <Text style={[styles.sendOrderText, { color: colorTheme.text.onAccent }]}>Trimite comanda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleScreenContainer: {
    marginBottom: 20,
  },
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
