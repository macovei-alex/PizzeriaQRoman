import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useColorTheme from "@/hooks/useColorTheme";
import { router } from "expo-router";
import TickCheckboxSvg from "@/components/svg/TickCheckboxSvg";

export default function Confirmation() {
  const colorTheme = useColorTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colorTheme.background[100] }]}>
      <View style={[styles.container, { backgroundColor: colorTheme.background[600] }]}>
        <TickCheckboxSvg checked={true} style={styles.icon} />

        <Text style={[styles.mainMessageText, { color: colorTheme.text[100] }]}>
          Comanda dumneavostră va fi preluată în cel mai scurt timp
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colorTheme.background[500] }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: colorTheme.text[300] }]}>Înapoi la comandă</Text>
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
