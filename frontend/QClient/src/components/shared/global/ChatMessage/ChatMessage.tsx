import React from "react";
import { StyleSheet, Text, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import { Message } from "./types/Message";
import { formatTime } from "src/utils/utils";

type CharMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: CharMessageProps) {
  logger.render("ChatMessage");

  const colorTheme = useColorTheme();

  return (
    <View style={[styles.container, { backgroundColor: colorTheme.background.card }]}>
      <View style={styles.messageDetailsContainer}>
        <Text style={styles.senderText}>{message.sender}</Text>
        <Text style={styles.timeText}>{formatTime(message.createdAt)}</Text>
      </View>
      <Text>{message.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
  },
  messageDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  senderText: {
    fontSize: 16,
    fontWeight: "600",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
