import config from "../api/config";
import axios from "axios";

const baseProductRoute = `${config.baseApiUrl}/product`;
const baseCategoryRoute = `${config.baseApiUrl}/category`;

async function fetchProducts() {
  return (await axios.get(`${baseProductRoute}/all`)).data;
}

async function fetchCategories() {
  return (await axios.get(`${baseCategoryRoute}/all`)).data;
}

async function fetchProductWithOptions(productId) {
  return (await axios.get(`${baseProductRoute}/${productId}`)).data;
}

export { fetchProducts, fetchCategories, fetchProductWithOptions };
