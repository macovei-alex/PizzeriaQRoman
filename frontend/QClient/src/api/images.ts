import { ValidImageFile } from "src/utils/files";
import { api } from ".";

export const fetchImageRefetchCheck = {
  queryFn: async (doImageRefetch: "yes" | "no") =>
    (await api.axios.get(`/image/changes/${doImageRefetch}`)).data as boolean,
  queryKey: () => null,
};

export const fetchImages = {
  queryFn: async () => (await api.axios.get("/image/all")).data as ValidImageFile[],
  queryKey: () => ["images"],
};
