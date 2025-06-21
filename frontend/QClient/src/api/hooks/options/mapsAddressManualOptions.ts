import { UseQueryOptions } from "@tanstack/react-query";
import { api } from "src/api";

export function mapsAddressManualOptions(
  latitude: number,
  longitude: number
): UseQueryOptions<string, Error> {
  return {
    queryKey: ["navigation", "address", latitude, longitude],
    queryFn: async () =>
      api.axios.get<string>(api.routes.locations.address(latitude, longitude)).then((res) => res.data),
    gcTime: 0,
    enabled: false,
  };
}
