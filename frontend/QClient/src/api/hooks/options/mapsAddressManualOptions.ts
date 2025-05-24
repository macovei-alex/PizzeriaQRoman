import { api } from "src/api";

export function mapsAddressManualOptions(latitude: number, longitude: number) {
  return {
    queryKey: ["navigation", "address", latitude, longitude],
    queryFn: async () =>
      api.axios.get<string>(api.routes.navigation.address(latitude, longitude)).then((res) => res.data),
    gcTime: 0,
    enabled: false,
  };
}
