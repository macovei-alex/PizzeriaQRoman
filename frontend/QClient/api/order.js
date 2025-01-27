import axios from "axios";
import config from "./config";

const baseOrderRoute = `${config.baseApiUrl}/order`;

export async function sendOrder(order) {
  return (await axios.post(`${baseOrderRoute}/place`, order)).data;
}
