import axios from "axios";
import { ENV } from "src/constants";

export const api = {
  axios: axios.create({
    baseURL: ENV.EXPO_PUBLIC_API_BASE_URL,
    withCredentials: false,
    timeout: 5000,
  }),
};
