import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Link style={styles.link} href="/menu">
        /menu
      </Link>
      <Link style={styles.link} href="/test">
        /test
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    gap: 4,
  },
  link: {
    color: "blue",
    fontSize: 20,
  },
});
