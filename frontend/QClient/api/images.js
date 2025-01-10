import axios from "axios";
import config from "./config";

const baseImageRoute = `${config.baseApiUrl}/image`;

export async function fetchImageRefetchCheck() {
  return (await axios.get(`${baseImageRoute}/changes/0`)).data;
}

export async function fetchImages() {
  return (await axios.get(`${baseImageRoute}/all`)).data;
}
