import { ScrollView, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButtonSvg from "src/components/svg/GoBackButtonSvg";
import logger from "src/utils/logger";

export default function TestScreen() {
  logger.render("TestScreen");

  return (
    <SafeAreaView>
      <TouchableOpacity style={styles.button}>
        <Text style={{ color: "white" }}>Delete images from disk and refetch them</Text>
      </TouchableOpacity>
      <ScrollView>
        <TouchableOpacity>
          <GoBackButtonSvg style={{ width: 38, height: 38 }} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
  },
});
