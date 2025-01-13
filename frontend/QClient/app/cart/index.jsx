import { SafeAreaView } from "react-native-safe-area-context";
import { useCartContext } from "../../context/useCartContext";
import { ScrollView } from "react-native";
import CartItem from "./CartItem";

export default function Cart() {
  const { cart } = useCartContext();

  return (
    <SafeAreaView>
      <ScrollView>
        {cart.map((cartItem) => (
          <CartItem key={cartItem.product.id} cartItem={cartItem} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
