import { SafeAreaView } from "react-native-safe-area-context";
import { useCartContext } from "../../context/useCartContext";
import { ScrollView, Text } from "react-native";
import { Fragment } from "react";

export default function Cart() {
  const { cart } = useCartContext();

  return (
    <SafeAreaView>
      <ScrollView>
        {cart.map((cartItem) => (
          <Fragment key={cartItem.product.id}>
            <Text>{cartItem.product.name}</Text>
            <Text>{cartItem.count}</Text>
          </Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
