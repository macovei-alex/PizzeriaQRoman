import React from "react";
import { StyleSheet, Text, View } from "react-native";
import EmptyCartSvg from "src/components/svg/EmptyCartSvg";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";

export default function EmptyCartScreen() {
  logger.render("EmptyCartScreen");

  const colorTheme = useColorTheme();

  return (
    <View style={[styles.container, { backgroundColor: colorTheme.background.primary }]}>
      <EmptyCartSvg style={styles.image} stroke={colorTheme.text.secondary} />
      <Text style={[styles.emptyCartText, { color: colorTheme.text.secondary }]}>Coșul este gol</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 320,
    height: 320,
    margin: -20,
  },
  emptyCartText: {
    fontSize: 24,
    fontWeight: "600",
  },
});
