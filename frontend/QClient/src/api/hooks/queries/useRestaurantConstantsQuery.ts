import { useQuery } from "@tanstack/react-query";
import { api } from "src/api";
import { RestaurantConstants } from "src/api/types/ResutaurantConstants";

export default function useRestaurantConstantsQuery() {
  return useQuery<RestaurantConstants, Error>({
    queryKey: ["restaurant-constants"],
    queryFn: async () => (await api.axios.get<RestaurantConstants>(api.routes.restaurant)).data,
  });
}
