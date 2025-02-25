import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logger from "src/utils/logger";

export default function ConsoleScreen() {
  const [, setRefresh] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefresh((prev) => prev + 1);
    }, [])
  );

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          logger.logs.splice(0, logger.logs.length);
          setRefresh((prev) => prev + 1);
        }}
        style={{ backgroundColor: "red", alignItems: "center", paddingVertical: 10, width: "30%" }}
      >
        <Text>Clear logs</Text>
      </TouchableOpacity>
      <FlatList
        data={logger.logs.map((log, index) => ({
          log,
          index,
        }))}
        renderItem={({ item }) => (
          <Text style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 10 }}>
            {`\$ ${item.index}\n${item.log}`}
          </Text>
        )}
      ></FlatList>
    </SafeAreaView>
  );
}
