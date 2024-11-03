import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex flex-col items-center justify-center h-full">
      <Link className="text-blue-500" href="/menu">
        /menu
      </Link>
    </SafeAreaView>
  );
}
