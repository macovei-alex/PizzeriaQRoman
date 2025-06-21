import { useQuery } from "@tanstack/react-query";
import { api } from "src/api";
import { Coordinates } from "src/api/types/Location";

export default function useRestaurantLocationQuery() {
  return useQuery<Coordinates, Error>({
    queryKey: ["restaurantLocation"],
    queryFn: async () => (await api.axios.get<Coordinates>(api.routes.locations.restaurant)).data,
  });
}
