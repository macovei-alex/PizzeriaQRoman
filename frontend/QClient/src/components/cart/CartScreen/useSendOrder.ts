import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { api } from "src/api";
import { addressesQueryOptions } from "src/api/queries/addressesQuery";
import { orderHistoryInfiniteQueryOptions } from "src/api/queries/orderHistoryInfiniteQuery";
import { productsQueryOptions } from "src/api/queries/productsQuery";
import { restaurantConstantsQueryOptions } from "src/api/queries/restaurantConstantsQuery";
import { Address } from "src/api/types/Address";
import { PlacedOrder } from "src/api/types/order/PlacedOrder";
import logger from "src/constants/logger";
import { useValidAccountId } from "src/context/AuthContext";
import { useCartContext } from "src/context/CartContext/CartContext";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import { convertCartItemOptions } from "src/utils/convertions";
import { showToast } from "src/utils/toast";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<CartStackParamList, "CartScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

export function useSendOrder(totalPrice: number) {
  logger.render("useSendingOrderDetails");

  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProps>();
  const accountId = useValidAccountId();
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { cart, emptyCart } = useCartContext();

  const handleSendOrderError = (error: Error) => {
    if (!isAxiosError(error)) {
      setError("A apărut o eroare neprevăzută la trimiterea comenzii. Vă rugăm să reîncercați.");
      logger.error("Unexpected error sending order:", error);
      return;
    }

    if (error.response?.status === 417 && typeof error.response?.data === "string") {
      const responseString = error.response.data.toLowerCase();

      if (responseString.includes("phone number") && responseString.includes("missing")) {
        showToast("Vă rugăm să introduceți un număr de telefon");
        navigation.navigate("MainTabNavigator", {
          screen: "ProfileStackNavigator",
          params: { screen: "ProfileScreen" },
        });
      } else if (responseString.includes("price") && responseString.includes("match")) {
        setError("Prețul comenzii nu se potrivește cu cel calculat în sistem. Vă rugăm să reîncercați.");
        queryClient.invalidateQueries(productsQueryOptions());
      }

      return;
    }

    setError("A apărut o eroare neprevăzută la trimiterea comenzii. Vă rugăm să reîncercați.");
    queryClient.invalidateQueries(productsQueryOptions());
    queryClient.invalidateQueries(addressesQueryOptions(accountId));
    queryClient.invalidateQueries(restaurantConstantsQueryOptions());
    logger.error(
      "Error sending order:",
      error.response?.data ?? "Response data missing. Request data: " + error.request?.data
    );
  };

  const sendOrder = (address?: Address, additionalNotes?: string) => {
    if (cart.length === 0) return;
    if (!address) {
      showToast("Selectați o adresă de livrare");
      return;
    }

    const order: PlacedOrder = {
      addressId: address.id,
      items: cart.map((cartItem) => ({
        productId: cartItem.product.id,
        count: cartItem.count,
        optionLists: convertCartItemOptions(cartItem.options),
      })),
      additionalNotes: additionalNotes,
      clientExpectedPrice: totalPrice,
    };

    setIsSending(true);

    api.axios
      .post(api.routes.account(accountId).orders, order)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          emptyCart();
          navigation.navigate("OrderConfirmationScreen");
        } else {
          setError("Comanda nu a putut fi trimisă. Vă rugăm să reîncercați.");
          logger.error("Error sending order:", res.data);
        }
        queryClient.invalidateQueries(orderHistoryInfiniteQueryOptions(accountId));
        queryClient.prefetchInfiniteQuery(orderHistoryInfiniteQueryOptions(accountId));
      })
      .catch((error: Error) => handleSendOrderError(error))
      .finally(() => setIsSending(false));
  };

  return { sendOrder, isSending, error, setError };
}
