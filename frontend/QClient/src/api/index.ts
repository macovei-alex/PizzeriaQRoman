import axios from "axios";
import { ENV } from "src/constants";
import { ProductId } from "./types/Product";
import { AddressId } from "./types/Address";
import { AccountId } from "src/context/AuthContext";
import { OrderId } from "./types/Order";

export const api = {
  axios: axios.create({
    baseURL: ENV.EXPO_PUBLIC_API_BASE_URL,
    withCredentials: false,
    timeout: 5000,
  }),

  routes: Object.freeze({
    account: (accountId: AccountId) => {
      return {
        self: `/accounts/${accountId}`,
        phoneNumber: `/accounts/${accountId}/phone-number`,
        addresses: `/accounts/${accountId}/addresses`,
        address: (addressId: AddressId) => `/accounts/${accountId}/addresses/${addressId}`,
        orders: `/accounts/${accountId}/orders`,
        order: (orderId: OrderId) => `/accounts/${accountId}/orders/${orderId}`,
      };
    },
    categories: "/categories",
    products: "/products",
    product: (productId: ProductId) => `/products/${productId}`,
  }),
};
