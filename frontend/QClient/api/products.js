import config from "../api/config";
import axios from "axios";

const baseProductRoute = `${config.baseApiUrl}${
  config.useMockApi ? "/mock" : ""
}/product`;
const baseCategoryRoute = `${config.baseApiUrl}${
  config.useMockApi ? "/mock" : ""
}/category`;

async function fetchProductsMock() {
  return (await axios.get(`${baseProductRoute}/all`)).data;
}

async function fetchCategoriesMock() {
  return (await axios.get(`${baseCategoryRoute}/all`)).data;
}

async function fetchProductExtendedMock(productId) {
  return (await axios.get(`${baseProductRoute}/${productId}`)).data;
}

export { fetchProductsMock, fetchCategoriesMock };
