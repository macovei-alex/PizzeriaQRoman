import axios from "axios";
import config from "./config";

const baseImageRoute = `${config.baseApiUrl}/image`;

async function fetchImages() {
  return (await axios.get(`${baseImageRoute}/all`)).data;
}

export { fetchImages };
