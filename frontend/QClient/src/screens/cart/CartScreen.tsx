import React, { useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import ProductSection from "src/components/cart/CartScreen/ProductSection";
import { useCartContext } from "src/context/CartContext/CartContext";
import { showToast } from "src/utils/toast";
import logger from "src/constants/logger";
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
import useAddressesQuery, { addressesQueryOptions } from "src/api/queries/addressesQuery";
import { useValidAccountId } from "src/context/AuthContext";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import { AxiosError } from "axios";
import { PlacedOrder } from "src/api/types/order/PlacedOrder";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import EmptyCartScreen from "src/components/cart/CartScreen/EmptyCartScreen";
import { CartItem } from "src/context/CartContext/types";
import useRestaurantConstantsQuery, {
  restaurantConstantsQueryOptions,
} from "src/api/queries/restaurantConstantsQuery";
import { orderHistoryInfiniteQueryOptions } from "src/api/queries/orderHistoryInfiniteQuery";
import { productsQueryOptions } from "src/api/queries/productsQuery";

function calculatePrice(item: CartItem) {
  let price = item.product.price;
  for (const [optionListId, optionList] of Object.entries(item.options)) {
    for (const [optionId, optionCount] of Object.entries(optionList)) {
      const list = item.product.optionLists.find((list) => list.id === Number(optionListId));
      if (!list) {
        throw new Error(`Option list not found: ${optionListId}`);
      }
      const option = list.options.find((option) => option.id === Number(optionId));
      if (!option) {
        throw new Error(`Option not found: ${optionId}`);
      }

      price += option.price * optionCount;
    }
  }
  return price * item.count;
}

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList, "CartScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function CartScreen() {
  logger.render("CartScreen");

  const accountId = useValidAccountId();
  const navigation = useNavigation<NavigationProps>();
  const { cart, emptyCart } = useCartContext();
  const queryClient = useQueryClient();
  const addressQuery = useAddressesQuery();
  const restaurantConstantsQuery = useRestaurantConstantsQuery();
  const [sendOrderError, setSendOrderError] = useState<string | null>(null);
  const [sendingOrder, setSendingOrder] = useState(false);
  const additionalSectionRef = useRef<AdditionalInfoSectionHandle>(null);

  const prices = useMemo(() => cart.map((cartItem) => calculatePrice(cartItem)), [cart]);
  const totalPrice = prices.reduce((acc, price) => acc + price, 0);

  function sendOrder() {
    if (cart.length === 0) return;
    if (!additionalSectionRef.current?.getAddress()) {
      showToast("Selectați o adresă de livrare");
      return;
    }

    const order: PlacedOrder = {
      addressId: additionalSectionRef.current.getAddress()!.id,
      items: cart.map((cartItem) => ({
        productId: cartItem.product.id,
        count: cartItem.count,
        optionLists: convertCartItemOptions(cartItem.options),
      })),
      additionalNotes: additionalSectionRef.current.getAdditionalNotes(),
      clientExpectedPrice: totalPrice,
    };

    setSendingOrder(true);

    api.axios
      .post(api.routes.account(accountId).orders, order)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          emptyCart();
          navigation.navigate("OrderConfirmationScreen");
        } else {
          setSendOrderError("Comanda nu a putut fi trimisă. Vă rugăm să reîncercați.");
          logger.error("Error sending order:", res.data);
        }
        queryClient.invalidateQueries(orderHistoryInfiniteQueryOptions(accountId));
        queryClient.prefetchInfiniteQuery(orderHistoryInfiniteQueryOptions(accountId));
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 417 && typeof error.response?.data === "string") {
          if (error.response.data.toLowerCase().includes("phone number is missing")) {
            showToast("Vă rugăm să introduceți un număr de telefon");
            navigation.navigate("MainTabNavigator", {
              screen: "ProfileStackNavigator",
              params: { screen: "ProfileScreen" },
            });
          } else if (error.response.data.toLowerCase().includes("price does not match")) {
            setSendOrderError(
              "Prețul comenzii nu se potrivește cu cel calculat în sistem. Vă rugăm să reîncercați."
            );
            queryClient.invalidateQueries(productsQueryOptions());
          }
        } else {
          setSendOrderError("A apărut o eroare la trimiterea comenzii. Vă rugăm să reîncercați.");
          queryClient.invalidateQueries(productsQueryOptions());
          queryClient.invalidateQueries(addressesQueryOptions(accountId));
          queryClient.invalidateQueries(restaurantConstantsQueryOptions());
          logger.error(
            "Error sending order:",
            error.response?.data ?? "Response data missing. Request data: " + error.request?.data
          );
        }
      })
      .finally(() => setSendingOrder(false));
  }

  if (sendingOrder) return <ScreenActivityIndicator text="Se trimite comanda..." />;
  if (sendOrderError)
    return <ErrorComponent message={sendOrderError} onRetry={() => setSendOrderError(null)} />;

  if (addressQuery.isFetching) return <ScreenActivityIndicator text="Se încarcă adresele..." />;
  if (addressQuery.isError) return <ErrorComponent />;
  if (!addressQuery.data) throw new Error("Addresses not found");
  if (cart.length === 0) return <EmptyCartScreen />;

  const isOrderButtonEnabled =
    !sendingOrder &&
    totalPrice >= (restaurantConstantsQuery.data?.minimumOrderValue ?? 0) &&
    additionalSectionRef.current?.getAddress() !== null;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <ScrollView
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => addressQuery.refetch()} />}
      >
        <ScreenTitle title="Coșul meu" containerStyle={styles.titleScreenContainer} />

        <ProductSection totalPrice={totalPrice} prices={prices} />

        <AdditionalInfoSection addresses={addressQuery.data} ref={additionalSectionRef} />

        <View style={styles.sendOrderContainer}>
          <TouchableOpacity
            style={styles.sendOrderButton(isOrderButtonEnabled)}
            onPress={sendOrder}
            disabled={!isOrderButtonEnabled}
          >
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
  sendOrderButton: (isEnabled: boolean) => ({
    paddingHorizontal: 52,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: theme.background.accent,
    opacity: isEnabled ? 1 : 0.5,
  }),
  sendOrderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text.onAccent,
  },
}));
