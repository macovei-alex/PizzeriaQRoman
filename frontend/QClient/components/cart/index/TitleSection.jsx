import { StyleSheet, Text, View } from "react-native";
import HorizontalLine from "../../menu/product/HorizontalLine";
import useColorTheme from "../../../hooks/useColorTheme";

export default function TitleSection() {
  const colorTheme = useColorTheme();

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, { color: colorTheme.text[100] }]}>Comanda mea</Text>
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
