import * as productFetches from "./products";
import * as imageFetches from "./images";

const api = {
  ...productFetches,
  ...imageFetches,
};
export default api;
