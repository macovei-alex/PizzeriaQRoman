import axios from "axios";
import { ENV } from "src/constants/env";
import { ProductId } from "./types/Product";
import { AddressId } from "./types/Address";
import { AccountId } from "src/context/AuthContext";
import { OrderId } from "./types/order/Order";

export const api = {
  axios: axios.create({
    baseURL: ENV.EXPO_PUBLIC_API_BASE_URL,
    withCredentials: false,
    timeout: 5000,
  }),

  routes: Object.freeze({
    account: (accountId: AccountId) => {
      const base = `/accounts/${accountId}`;
      return {
        self: base,
        phoneNumber: `${base}/phone-number`,
        addresses: `${base}/addresses`,
        address: (addressId: AddressId) => `${base}/addresses/${addressId}`,
        orders: `${base}/orders`,
        order: (orderId: OrderId) => `${base}/orders/${orderId}`,
        search: {
          self: `${base}/search`,
          history: `${base}/search/history`,
        },
      };
    },
    categories: "/categories",
    products: "/products",
    product: (productId: ProductId) => `/products/${productId}`,
    navigation: {
      directions: (
        origin: { latitude: number; longitude: number },
        destination: { latitude: number; longitude: number }
      ) =>
        `/navigation/directions?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}`,
      address: (latitude: number, longitude: number) =>
        `/navigation/address?latitude=${latitude}&longitude=${longitude}`,
      coordinates: (address: string) => `/navigation/coordinates?address=${encodeURIComponent(address)}`,
    },
    notifications: {
      pushTokens: "/notifications/push-tokens",
    },
  }),
};
