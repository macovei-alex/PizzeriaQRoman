import React from "react";
import { Text, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import EmptyCartSvg from "src/components/svg/EmptyCartSvg";
import logger from "src/utils/logger";

export default function EmptyCartScreen() {
  logger.render("EmptyCartScreen");

  return (
    <View style={styles.container}>
      <UEmptyCartSvg style={styles.image} />
      <Text style={styles.emptyCartText}>Coșul este gol</Text>
    </View>
  );
}

const UEmptyCartSvg = withUnistyles(EmptyCartSvg, (theme) => ({
  stroke: theme.text.secondary,
}));

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background.primary,
  },
  image: {
    width: 320,
    height: 320,
    margin: -20,
  },
  emptyCartText: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.text.secondary,
  },
}));
