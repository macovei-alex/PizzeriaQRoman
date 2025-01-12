import axios from "axios";
import config from "./config";

const baseImageRoute = `${config.baseApiUrl}/image`;

/**
 * @param {"yes" | any} doImageRefetch
 * @returns {Promise<boolean>}
 */
export async function fetchImageRefetchCheck(doImageRefetch) {
  return (await axios.get(`${baseImageRoute}/changes/${doImageRefetch}`)).data;
}

/**
 * @returns {Promise<{ name: string, data: string }[]>}
 */
export async function fetchImages() {
  return (await axios.get(`${baseImageRoute}/all`)).data;
}
