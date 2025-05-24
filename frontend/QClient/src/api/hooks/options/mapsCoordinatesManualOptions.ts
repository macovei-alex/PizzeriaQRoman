import { api } from "src/api";

type Coordinates = {
  lat: number;
  lng: number;
};

export function mapsCoordinatesManualOptions(address: string) {
  return {
    queryKey: ["navigation", "location", address],
    queryFn: async () =>
      api.axios.get<Coordinates>(api.routes.navigation.coordinates(address)).then((res) => res.data),
    gcTime: 0,
    enabled: false,
  };
}
