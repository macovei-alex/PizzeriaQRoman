import { SafeAreaView } from "react-native-safe-area-context";
import { useCartContext } from "../../context/useCartContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CartItem from "../../components/cart/index/CartItem";
import { useColorTheme } from "../../hooks/useColorTheme";
import HorizontalLine from "../../components/menu/product/HorizontalLine";

export default function Cart() {
  const { cart } = useCartContext();
  const colorTheme = useColorTheme();

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: colorTheme.text[100] }]}>Comanda mea</Text>
        </View>
        <HorizontalLine style={styles.hr} />
        {cart.map((cartItem) => (
          <CartItem key={cartItem.product.id} cartItem={cartItem} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "500",
  },
  hr: {
    height: 3,
    marginBottom: 20,
  },
});
