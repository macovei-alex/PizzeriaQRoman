import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "src/context/AuthContext";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";

type ProfileScreenProps = { navigation: NativeStackNavigationProp<ProfileStackParamList, "ProfileScreen"> };

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const authContext = useAuthContext();

  return (
    <SafeAreaView>
      <Button title="Deconectare" onPress={authContext.logout} />
      <Button title="Istoricul Comenzilor" onPress={() => navigation.push("OrderHistoryScreen")} />
    </SafeAreaView>
  );
}
