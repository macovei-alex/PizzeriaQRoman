import * as productFetches from "./products";
import * as imageFetches from "./images";
import * as orderApi from "./order";

const api = {
  ...productFetches,
  ...imageFetches,
  ...orderApi,
};
export default api;
