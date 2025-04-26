import axios from "axios";
import { ValidImageFile } from "src/utils/files";
import { api } from ".";

const baseImageRoute = `${api.config.baseUrl}/image`;

export const fetchImageRefetchCheck = {
  queryFn: async (doImageRefetch: "yes" | "no") =>
    (await axios.get(`${baseImageRoute}/changes/${doImageRefetch}`)).data as boolean,
  queryKey: () => null,
};

export const fetchImages = {
  queryFn: async () => (await axios.get(`${baseImageRoute}/all`)).data as ValidImageFile[],
  queryKey: () => ["images"],
};
