import axios from "axios";
import config from "./config";
import { HistoryOrder, HistoryOrderDTO, PlacedOrder } from "./types/Order";

const baseOrderRoute = `${config.baseApiUrl}/order`;

export async function sendOrder(order: PlacedOrder) {
  return axios.post(`${baseOrderRoute}/place`, order);
}

export const fetchOrderHistory = {
  // TODO: Experiment with .then() instead of await for api functions
  queryFn: async () => {
    const historyOrderDtos = (await axios.get(`${baseOrderRoute}/history`)).data as HistoryOrderDTO[];
    return historyOrderDtos.map((dto) => {
      return {
        ...dto,
        orderTimestamp: new Date(dto.orderTimestamp),
        deliveryTimestamp: !!dto.deliveryTimestamp ? new Date(dto.deliveryTimestamp) : null,
      } as HistoryOrder;
    });
  },
  queryKey: () => ["order-history"],
};
