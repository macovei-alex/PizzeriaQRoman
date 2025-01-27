import { Text, View } from "react-native";
import useApiOrderHistory from "../../hooks/useApiOrderHistory";

export default function OrderHistory() {
  const ordersQuery = useApiOrderHistory();

  if (ordersQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (ordersQuery.isError) {
    return <Text>Error: {ordersQuery.error.message}</Text>;
  }

  // TODO: Create the layout for the order history
  return (
    <View>
      <Text>{JSON.stringify(ordersQuery.data)}</Text>
    </View>
  );
}
