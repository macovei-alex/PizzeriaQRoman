import { PlacedOrder } from "./types/Order";
import { resApi } from ".";

export async function sendOrder(order: PlacedOrder) {
  return resApi.axios.post("/order/place", order);
}
