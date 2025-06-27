import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import logger from "src/constants/logger";
import HorizontalLine from "./HorizontalLine";

type ScreenTitleProps = {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function ScreenTitle({ title, containerStyle }: ScreenTitleProps) {
  logger.render("TitleSection");

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <Text style={styles.title}>{title}</Text>
        <HorizontalLine style={styles.horizontalLine} />
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    paddingVertical: 16,
    color: theme.text.primary,
  },
  horizontalLine: {
    height: 3,
  },
}));
