import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex flex-col items-center justify-center h-full gap-4">
      <Link className="text-blue-500 text-xl" href="/menu">
        /menu
      </Link>
      <Link className="text-blue-500 text-xl" href="/test-component">
        /test-component
      </Link>
    </SafeAreaView>
  );
}
