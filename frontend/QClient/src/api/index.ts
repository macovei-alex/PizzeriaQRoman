import axios from "axios";
import { ENV } from "src/constants";
import { ProductId } from "./types/Product";

export const api = {
  axios: axios.create({
    baseURL: ENV.EXPO_PUBLIC_API_BASE_URL,
    withCredentials: false,
    timeout: 5000,
  }),

  routes: Object.freeze({
    account: (accountId: string) => {
      return {
        addresses: `/accounts/${accountId}/addresses`,
        address: (addressId: number) => `/accounts/${accountId}/addresses/${addressId}`,
        orders: `/accounts/${accountId}/orders`,
      };
    },
    categories: "/categories",
    products: "/products",
    product: (productId: ProductId) => `/products/${productId}`,
  }),
};
