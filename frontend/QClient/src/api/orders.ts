import { PlacedOrder } from "./types/Order";
import { api } from ".";

export async function sendOrder(order: PlacedOrder) {
  return api.axios.post("/order/place", order);
}
