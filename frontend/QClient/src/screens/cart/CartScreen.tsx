import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import { api } from "src/api";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import AdditionalInfoSection, {
  AdditionalInfoSectionHandle,
} from "src/components/cart/CartScreen/AdditionalInfoSection";
import useAddressesQuery from "src/api/hooks/useAddressesQuery";
import { useAuthContext } from "src/context/AuthContext";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList, "CartScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function CartScreen() {
  logger.render("CartScreen");

  const navigation = useNavigation<NavigationProps>();
  const colorTheme = useColorTheme();
  const authContext = useAuthContext();
  const { cart, emptyCart } = useCartContext();
  const queryClient = useQueryClient();
  const addressQuery = useAddressesQuery();
  const [sendingOrder, setSendingOrder] = useState(false);
  const additionalSectionRef = useRef<AdditionalInfoSectionHandle>(null);

  if (!authContext.account) throw new Error("Account is not defined in CartScreen");

  function sendOrder() {
    if (cart.length === 0) {
      showToast("Coșul este gol");
      return;
    }
    if (!additionalSectionRef.current?.getAddress()) {
      showToast("Selectați o adresă de livrare");
      return;
    }

    setSendingOrder(true);

    const order: PlacedOrder = {
      addressId: additionalSectionRef.current.getAddress()!.id,
      items: cart.map((cartItem) => ({
        productId: cartItem.product.id,
        count: cartItem.count,
        optionLists: convertCartItemOptions(cartItem.options),
      })),
      additionalNotes: additionalSectionRef.current.getAdditionalNotes(),
    };

    api.axios
      .post(api.routes.account(authContext.account!.id).orders, order)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          emptyCart();
          navigation.navigate("OrderConfirmationScreen");
        } else {
          logger.error("Error sending order:", res.data);
        }
        queryClient.invalidateQueries({ queryKey: ["order-history"] });
        queryClient.prefetchInfiniteQuery({ queryKey: ["order-history"], initialPageParam: 0 });
      })
      .catch((error) => {
        logger.error("Error sending order:", error.response.data);
      })
      .finally(() => {
        setSendingOrder(false);
      });
  }

  if (sendingOrder) return <ScreenActivityIndicator text="Se trimite comanda..." />;
  if (addressQuery.isFetching) return <ScreenActivityIndicator text="Se încarcă adresele..." />;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.screen, { backgroundColor: colorTheme.background.primary }]}
    >
      <SafeAreaView>
        <ScrollView>
          <ScreenTitle title={"Comanda mea"} containerStyle={styles.titleScreenContainer} />

          <ProductSection />

          <AdditionalInfoSection addresses={addressQuery.data!} ref={additionalSectionRef} />

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleScreenContainer: {
    marginBottom: 20,
  },
  sendOrderContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
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
