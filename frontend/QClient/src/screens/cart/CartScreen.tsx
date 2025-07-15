import React, { useMemo, useRef } from "react";
import { KeyboardAvoidingView, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import ProductSection from "src/components/cart/CartScreen/ProductSection";
import { useCartContext } from "src/context/CartContext/CartContext";
import logger from "src/constants/logger";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import AdditionalInfoSection, {
  AdditionalInfoSectionHandle,
} from "src/components/cart/CartScreen/AdditionalInfoSection";
import useAddressesQuery from "src/api/queries/addressesQuery";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import EmptyCartScreen from "src/components/cart/CartScreen/EmptyCartScreen";
import { CartItem } from "src/context/CartContext/types";
import useRestaurantConstantsQuery from "src/api/queries/restaurantConstantsQuery";
import { useSendOrder } from "src/components/cart/CartScreen/useSendOrder";

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

export default function CartScreen() {
  logger.render("CartScreen");

  const { cart } = useCartContext();
  const addressQuery = useAddressesQuery();
  const restaurantConstantsQuery = useRestaurantConstantsQuery();
  const additionalSectionRef = useRef<AdditionalInfoSectionHandle>(null);

  const prices = useMemo(() => cart.map((cartItem) => calculatePrice(cartItem)), [cart]);
  const totalPrice = prices.reduce((acc, price) => acc + price, 0);

  const { sendOrder, isSending, error, setError } = useSendOrder(totalPrice);
  const sendOrderWithParams = () =>
    sendOrder(
      additionalSectionRef.current?.getAddress() ?? undefined,
      additionalSectionRef.current?.getAdditionalNotes()
    );

  if (isSending) return <ScreenActivityIndicator text="Se trimite comanda..." />;
  if (error) return <ErrorComponent message={error} onRetry={() => setError(null)} />;

  if (addressQuery.isFetching) return <ScreenActivityIndicator text="Se încarcă adresele..." />;
  if (addressQuery.isError) return <ErrorComponent />;
  if (!addressQuery.data) throw new Error("Addresses not found");
  if (cart.length === 0) return <EmptyCartScreen />;

  const isOrderButtonEnabled =
    !isSending &&
    totalPrice >= (restaurantConstantsQuery.data?.minimumOrderValue ?? 0) &&
    additionalSectionRef.current?.getAddress() !== null;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="height" keyboardVerticalOffset={100}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => addressQuery.refetch()} />}
      >
        <ScreenTitle title="Coșul meu" containerStyle={styles.titleScreenContainer} />

        <ProductSection totalPrice={totalPrice} prices={prices} />

        <AdditionalInfoSection addresses={addressQuery.data} ref={additionalSectionRef} />

        <View style={styles.sendOrderContainer}>
          <TouchableOpacity
            style={styles.sendOrderButton(isOrderButtonEnabled)}
            onPress={sendOrderWithParams}
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
