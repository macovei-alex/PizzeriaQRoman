import axios from "axios";
import config from "./config";

const baseOrderRoute = `${config.baseApiUrl}/order`;

/**
 * @param {{ productId: number, count: number }[]} order
 */
export async function sendOrder(order) {
  return axios.post(`${baseOrderRoute}/place`, order);
}

/**
 * @returns {Promise<{
 *    id: number,
 *    orderStatus: string,
 *    orderTimestamp: DateTime,
 *    deliveryTimestamp: DateTime,
 *    estimatedPreparationTime: number,
 *    additionalNotes: string,
 *    totalPrice: number,
 *    totalPriceWithDiscount: number,
 *    items: {
 *      productId: number,
 *      count: number
 *    }[]
 *  }>}
 */
export async function fetchOrderHistory() {
  // TODO: Experiment with .then() instead of await for api functions
  return (await axios.get(`${baseOrderRoute}/history`)).data;
}
