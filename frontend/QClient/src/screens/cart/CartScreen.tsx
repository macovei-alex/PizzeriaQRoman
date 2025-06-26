import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import ProductSection from "src/components/cart/CartScreen/ProductSection";
import { useCartContext } from "src/context/CartContext/CartContext";
import { showToast } from "src/utils/toast";
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
import useAddressesQuery from "src/api/hooks/queries/useAddressesQuery";
import { useAuthContext } from "src/context/AuthContext";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import { AxiosError } from "axios";
import { PlacedOrder } from "src/api/types/order/PlacedOrder";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import EmptyCartScreen from "src/components/cart/CartScreen/EmptyCartScreen";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList, "CartScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function CartScreen() {
  logger.render("CartScreen");

  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account is not defined in CartScreen");
  const accountId = authContext.account.id;
  const navigation = useNavigation<NavigationProps>();
  const { cart, emptyCart } = useCartContext();
  const queryClient = useQueryClient();
  const addressQuery = useAddressesQuery();
  const [sendingOrder, setSendingOrder] = useState(false);
  const additionalSectionRef = useRef<AdditionalInfoSectionHandle>(null);

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
      .post(api.routes.account(accountId).orders, order)
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
      .catch((error: AxiosError) => {
        if (
          error.response?.status === 417 &&
          typeof error.response?.data === "string" &&
          error.response.data.toLowerCase().includes("phone number is missing")
        ) {
          showToast("Vă rugăm să introduceți un număr de telefon");
          navigation.navigate("MainTabNavigator", {
            screen: "ProfileStackNavigator",
            params: { screen: "ProfileScreen" },
          });
        } else {
          logger.error(
            "Error sending order:",
            error.response?.data ?? "Response data missing. Request data: " + error.request?.data
          );
        }
      })
      .finally(() => setSendingOrder(false));
  }

  if (sendingOrder) return <ScreenActivityIndicator text="Se trimite comanda..." />;
  if (addressQuery.isFetching) return <ScreenActivityIndicator text="Se încarcă adresele..." />;
  if (addressQuery.isError) return <ErrorComponent />;
  if (!addressQuery.data) throw new Error("Addresses not found");
  if (cart.length === 0) return <EmptyCartScreen />;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <ScrollView
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => addressQuery.refetch()} />}
      >
        <ScreenTitle title="Coșul meu" containerStyle={styles.titleScreenContainer} />

        <ProductSection />

        <AdditionalInfoSection addresses={addressQuery.data} ref={additionalSectionRef} />

        <View style={styles.sendOrderContainer}>
          <TouchableOpacity style={styles.sendOrderButton} onPress={sendOrder}>
            <Text style={styles.sendOrderText}>Trimite comanda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.background.primary,
    paddingTop: runtime.insets.top,
  },
  titleScreenContainer: {
    marginBottom: 20,
  },
  sendOrderContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: runtime.insets.bottom,
  },
  sendOrderButton: {
    paddingHorizontal: 52,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: theme.background.accent,
  },
  sendOrderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text.onAccent,
  },
}));
