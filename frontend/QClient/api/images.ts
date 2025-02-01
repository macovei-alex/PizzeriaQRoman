import axios from "axios";
import config from "./config";
import { ValidImageFile } from "@/utils/files";

const baseImageRoute = `${config.baseApiUrl}/image`;

export async function fetchImageRefetchCheck(doImageRefetch: "yes" | "no") {
  return (await axios.get(`${baseImageRoute}/changes/${doImageRefetch}`)).data as boolean;
}

export async function fetchImages() {
  return (await axios.get(`${baseImageRoute}/all`)).data as ValidImageFile[];
}
