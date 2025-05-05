import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import { useAuthContext } from "src/context/AuthContext";
import { useCartContext } from "src/context/CartContext";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";
import logger from "src/utils/logger";

type NavigationProps = NativeStackNavigationProp<ProfileStackParamList, "ProfileScreen">;

export default function ProfileScreen() {
  logger.render("ProfileScreen");

  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView>
      <ScreenTitle title="Profilul Meu" />
      <Button
        title="Deconectare"
        onPress={() => {
          cartContext.emptyCart();
          authContext.logout();
        }}
      />
      <Button title="Istoricul Comenzilor" onPress={() => navigation.push("OrderHistoryScreen")} />
      <Button title="Adrese" onPress={() => navigation.push("AddressesScreen")} />
    </SafeAreaView>
  );
}
