import config from "./config";
import axios from "axios";
import { Product, ProductId, ProductWithOptions } from "./types/Product";
import { Category } from "./types/Category";

const baseProductRoute = `${config.baseApiUrl}/product`;
const baseCategoryRoute = `${config.baseApiUrl}/category`;

export const fetchProducts = {
  queryFn: async () => {
    return (await axios.get(`${baseProductRoute}/all`)).data as Product[];
  },
  queryKey: () => ["products"],
};

export const fetchCategories = {
  queryFn: async () => {
    return (await axios.get(`${baseCategoryRoute}/all`)).data as Category[];
  },
  queryKey: () => ["categories"],
};

export const fetchProductWithOptions = {
  queryFn: async (productId: ProductId) => {
    return (await axios.get(`${baseProductRoute}/${productId}`)).data as ProductWithOptions;
  },
  queryKey: (productId: ProductId) => ["product", productId],
};
