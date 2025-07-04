import axios from "axios";
import { ProductId } from "./types/Product";
import { AddressId } from "./types/Address";
import { AccountId } from "src/context/AuthContext";
import { OrderId } from "./types/order/Order";
import { ENV } from "src/constants/env";

export const api = {
  axios: axios.create({
    baseURL: ENV.API_BASE_URL,
    withCredentials: false,
    timeout: 5000,
  }),

  routes: Object.freeze({
    account: (accountId: AccountId) => {
      const accountBase = `/accounts/${accountId}`;
      return {
        self: accountBase,
        phoneNumber: `${accountBase}/phone-number`,
        addresses: `${accountBase}/addresses`,
        address: (addressId: AddressId) => `${accountBase}/addresses/${addressId}`,
        orders: `${accountBase}/orders`,
        order: (orderId: OrderId) => `${accountBase}/orders/${orderId}`,
        searches: `${accountBase}/searches`,
        searchHistory: `${accountBase}/search-history`,
      };
    },
    categories: "/categories",
    products: "/products",
    product: (productId: ProductId) => `/products/${productId}`,
    directions: (
      origin: { latitude: number; longitude: number },
      destination: { latitude: number; longitude: number }
    ) =>
      `/directions?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}`,
    locations: {
      address: (latitude: number, longitude: number) =>
        `/locations?latitude=${latitude}&longitude=${longitude}`,
      coordinates: (address: string) => `/locations?address=${encodeURIComponent(address)}`,
    },
    devices: "/devices",
    restaurant: "/restaurant",
  }),
};
