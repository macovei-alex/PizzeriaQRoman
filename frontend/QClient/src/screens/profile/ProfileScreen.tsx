import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "src/context/AuthContext";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";

type NavigationProps = NativeStackNavigationProp<ProfileStackParamList, "ProfileScreen">;

export default function ProfileScreen() {
  const authContext = useAuthContext();
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView>
      <Button title="Deconectare" onPress={authContext.logout} />
      <Button title="Istoricul Comenzilor" onPress={() => navigation.push("OrderHistoryScreen")} />
    </SafeAreaView>
  );
}
