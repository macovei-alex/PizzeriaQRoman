import { View, Text, StyleSheet, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const TestComponent = () => {
  return (
    <SafeAreaView className="flex flex-col items-center justify-center h-full">
      <View
        style={styles.shadowContainer}
        className="px-4 py-2 bg-bg-600 rounded-xl"
      >
        <Text>TestComponent</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default TestComponent;
