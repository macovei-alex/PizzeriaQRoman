import axios from "axios";
import config from "./config";
import { HistoryOrder, PlacedOrder } from "./types/Order";

const baseOrderRoute = `${config.baseApiUrl}/order`;

export async function sendOrder(order: PlacedOrder) {
  return axios.post(`${baseOrderRoute}/place`, order);
}

export const fetchOrderHistory = {
  // TODO: Experiment with .then() instead of await for api functions
  queryFn: async () => (await axios.get(`${baseOrderRoute}/history`)).data as HistoryOrder[],
  queryKey: () => ["order-history"],
};
