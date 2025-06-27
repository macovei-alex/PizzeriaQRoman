import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import TickCheckboxSvg from "src/components/svg/TickCheckboxSvg";
import logger from "src/constants/logger";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type OrderConfirmationScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "OrderConfirmationScreen"
>;

export default function OrderConfirmationScreen() {
  logger.render("ConfirmationScreen");

  const navigation = useNavigation<OrderConfirmationScreenNavigationProps>();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <TickCheckboxSvg checked={true} style={styles.icon} />

        <Text style={styles.mainMessageText}>Comanda dumneavostră va fi preluată în cel mai scurt timp</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("MainTabNavigator", {
                screen: "ProfileStackNavigator",
                params: {
                  screen: "OrderHistoryScreen",
                  initial: false,
                },
              });
            }}
          >
            <Text style={styles.buttonText} numberOfLines={2}>
              Către comenzile dumneavoastră
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.background.navbar,
  },
  container: {
    alignItems: "center",
    width: "90%",
    borderRadius: 20,
    backgroundColor: theme.background.primary,
  },
  icon: {
    width: 70,
    height: 70,
    marginTop: 20,
  },
  mainMessageText: {
    maxWidth: "85%",
    fontSize: 24,
    fontWeight: 500,
    marginTop: 20,
    marginBottom: 60,
    textAlign: "center",
    color: theme.text.primary,
  },
  buttonContainer: {
    marginHorizontal: 32,
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 32,
    backgroundColor: theme.background.success,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: theme.text.success,
  },
}));
