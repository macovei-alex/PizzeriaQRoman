import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "src/api";
import { RestaurantConstants } from "src/api/types/ResutaurantConstants";

export function restaurantConstantsQueryOptions(): UseQueryOptions<RestaurantConstants, Error> {
  return {
    queryKey: ["restaurant-constants"],
    queryFn: async () => (await api.axios.get<RestaurantConstants>(api.routes.restaurant)).data,
  };
}

export default function useRestaurantConstantsQuery() {
  return useQuery(restaurantConstantsQueryOptions());
}
