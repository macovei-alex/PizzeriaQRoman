import axios from "axios";

const config = {
  baseUrl: "http://192.168.1.4:10100/api",
};

export const api = {
  config: config,
  axios: axios.create({
    baseURL: config.baseUrl,
    withCredentials: false,
  }),
};
