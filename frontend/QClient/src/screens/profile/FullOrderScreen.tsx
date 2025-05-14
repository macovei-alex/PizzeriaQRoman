import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { useFullOrderQuery } from "src/api/hooks/useFullOrderQuery";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";

type RouteProps = RouteProp<ProfileStackParamList, "FullOrderScreen">;

export default function FullOrderScreen() {
  const route = useRoute<RouteProps>();
  if (!route.params?.orderId) throw new Error("Order ID is not defined in FullOrderScreen");

  const orderQuery = useFullOrderQuery(route.params.orderId);
  useEffect(() => {
    if (orderQuery.data) {
      console.log(orderQuery.data);
    }
  }, [orderQuery.data]);

  return null;
}
