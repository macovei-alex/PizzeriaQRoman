import config from "../api/config";

const baseProductRoute = `${config.baseApiUrl}${
  config.useMockApi ? "/mock" : ""
}/product`;
const baseCategoryRoute = `${config.baseApiUrl}${
  config.useMockApi ? "/mock" : ""
}/category`;

async function fetchProductsMock() {
  const response = await fetch(`${baseProductRoute}/all`);
  return await response.json();
}

async function fetchCategoriesMock() {
  const response = await fetch(`${baseCategoryRoute}/all`);
  return await response.json();
}

async function fetchProductExtendedMock(productId) {
  const response = await fetch(`${baseProductRoute}/${productId}`);
  return await response.json();
}

export { fetchProductsMock, fetchCategoriesMock };
