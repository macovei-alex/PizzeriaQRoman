import axios from "axios";

const resConfig = {
  baseUrl: "http://192.168.1.140:10100/api",
};

export const resApi = {
  config: resConfig,
  axios: axios.create({
    baseURL: "http://192.168.1.140:10100/api",
    withCredentials: false,
  }),
};
