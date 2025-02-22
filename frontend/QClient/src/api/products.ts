import config from "./config";
import axios from "axios";
import { Product, ProductId, ProductWithOptions } from "./types/Product";
import { Category } from "./types/Category";

const baseProductRoute = `${config.baseApiUrl}/product`;
const baseCategoryRoute = `${config.baseApiUrl}/category`;

async function fetchProducts() {
  return (await axios.get(`${baseProductRoute}/all`)).data as Product[];
}

async function fetchCategories() {
  return (await axios.get(`${baseCategoryRoute}/all`)).data as Category[];
}

async function fetchProductWithOptions(productId: ProductId) {
  return (await axios.get(`${baseProductRoute}/${productId}`)).data as ProductWithOptions;
}

export { fetchProducts, fetchCategories, fetchProductWithOptions };
