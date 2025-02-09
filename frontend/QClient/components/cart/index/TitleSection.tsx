import React from "react";
import { StyleSheet, Text, View } from "react-native";
import HorizontalLine from "@/components/menu/product/HorizontalLine";
import useColorTheme from "@/hooks/useColorTheme";
import logger from "@/utils/logger";

export default function TitleSection() {
  logger.render("TitleSection");

  const colorTheme = useColorTheme();

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, { color: colorTheme.text.primary }]}>Comanda mea</Text>
      </View>
      <HorizontalLine style={styles.hr} />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
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
