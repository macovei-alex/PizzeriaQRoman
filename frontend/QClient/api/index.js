import * as productsApi from "./products";
import * as imagesApi from "./images";
import * as ordersApi from "./orders";

const api = {
  ...productsApi,
  ...imagesApi,
  ...ordersApi,
};
export default api;
