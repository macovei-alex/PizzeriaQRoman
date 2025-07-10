import { UseQueryOptions } from "@tanstack/react-query";
import { api } from "src/api";
import { Coordinates } from "src/api/types/Location";

export function mapsCoordinatesManualOptions(
  address?: string,
  enabled: boolean = false
): UseQueryOptions<Coordinates, Error> {
  return {
    queryKey: ["navigation", "location", address],
    queryFn: async () =>
      api.axios.get<Coordinates>(api.routes.locations.coordinates(address ?? "")).then((res) => res.data),
    gcTime: 0,
    enabled,
  };
}
