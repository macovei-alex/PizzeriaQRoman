import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useColorTheme from "@/hooks/useColorTheme";
import { router } from "expo-router";
import TickCheckboxSvg from "@/components/svg/TickCheckboxSvg";
import logger from "@/utils/logger";

export default function Confirmation() {
  logger.render("Confirmation");

  const colorTheme = useColorTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colorTheme.background.navbar }]}>
      <View style={[styles.container, { backgroundColor: colorTheme.background.primary }]}>
        <TickCheckboxSvg checked={true} style={styles.icon} checkedFill={colorTheme.background.success} />

        <Text style={[styles.mainMessageText, { color: colorTheme.text.primary }]}>
          Comanda dumneavostră va fi preluată în cel mai scurt timp
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colorTheme.background.success }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: colorTheme.text.success }]}>Înapoi la comandă</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    width: "90%",
    borderRadius: 20,
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
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 16,
  },
});
