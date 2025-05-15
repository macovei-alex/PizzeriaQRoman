import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import HorizontalLine from "./HorizontalLine";

type ScreenTitleProps = {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function ScreenTitle({ title, containerStyle }: ScreenTitleProps) {
  logger.render("TitleSection");

  const colorTheme = useColorTheme();

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <Text style={[styles.title, { color: colorTheme.text.primary }]}>{title}</Text>
        <HorizontalLine style={styles.horizontalLine} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    paddingVertical: 16,
  },
  horizontalLine: {
    height: 3,
  },
});
