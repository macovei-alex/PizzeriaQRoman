import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Message } from "src/api/types/Message";
import logger from "src/utils/logger";
import { formatTime } from "src/utils/utils";

type CharMessageProps = {
  message: Message;
  isThinking: boolean;
};

export default function ChatMessage({ message, isThinking }: CharMessageProps) {
  logger.render("ChatMessage");

  return (
    <View style={styles.container}>
      <View style={styles.messageDetailsContainer}>
        {message.role === "assistant" && <Text style={styles.senderText}>Bot</Text>}
        <Text style={styles.timeText}>{formatTime(message.timestamp)}</Text>
      </View>
      {!isThinking ? <Text>{message.message}</Text> : <Text>...</Text>}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: 12,
    borderRadius: 16,
    minWidth: "100%",
    maxWidth: "100%",
    backgroundColor: theme.background.card,
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
    justifyContent: "flex-end",
  },
}));
