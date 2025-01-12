import config from "../api/config";
import axios from "axios";

const baseProductRoute = `${config.baseApiUrl}/product`;
const baseCategoryRoute = `${config.baseApiUrl}/category`;

/**
 * @returns {Promise<{
 *  id: number,
 *  name: string,
 *  sutitle: string,
 *  description: string,
 *  categoryId: number,
 *  price: number,
 *  imageName: string
 * }[]>}
 */
async function fetchProducts() {
  return (await axios.get(`${baseProductRoute}/all`)).data;
}

/**
 * @returns {Promise<{id: number, name: string}[]>}
 */
async function fetchCategories() {
  return (await axios.get(`${baseCategoryRoute}/all`)).data;
}

/**
 * @returns {Promise<{
 *  id: number,
 *  name: string,
 *  subtitle: string,
 *  description: string,
 *  price: number,
 *  imageName: string,
 *  categoryId: number,
 *  optionLists: {
 *    id: number,
 *    text: string,
 *    minChoices: number,
 *    maxChoices: number,
 *    options: {
 *      id: number,
 *      name: string,
 *      additionalDescription: string,
 *      price: number,
 *      minCount: number,
 *      maxCount: number
 *    }[]
 *  }[],
 * }[] }>}
 */
async function fetchProductWithOptions(productId) {
  return (await axios.get(`${baseProductRoute}/${productId}`)).data;
}

export { fetchProducts, fetchCategories, fetchProductWithOptions };
