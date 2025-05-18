import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import ChatMessage from "src/components/shared/global/ChatMessage/ChatMessage";
import { Message } from "src/components/shared/global/ChatMessage/types/Message";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";

const exampleMessages: Message[] = [
  {
    id: "1",
    sender: "You",
    content: "Hello, how are you?",
    createdAt: new Date(),
  },
  {
    id: "2",
    sender: "Bot",
    content: "I'm fine, thank you! How can I help you today?",
    createdAt: new Date(),
  },
  {
    id: "3",
    sender: "You",
    content: "Hello, how are you?",
    createdAt: new Date(),
  },
  {
    id: "4",
    sender: "Bot",
    content: "I'm fine, thank you! How can I help you today?",
    createdAt: new Date(),
  },
  {
    id: "5",
    sender: "You",
    content: "Hello, how are you?",
    createdAt: new Date(),
  },
  {
    id: "6",
    sender: "Bot",
    content: "I'm fine, thank you! How can I help you today?",
    createdAt: new Date(),
  },
  {
    id: "7",
    sender: "You",
    content: "Hello, how are you?",
    createdAt: new Date(),
  },
  {
    id: "8",
    sender: "Bot",
    content: "I'm fine, thank you! How can I help you today?",
    createdAt: new Date(),
  },
] as const;

export default function ChatScreen() {
  logger.render("ChatScreen");

  const colorTheme = useColorTheme();
  const messagesQuery = useQuery<Message[], Error>({
    queryFn: () => Promise.resolve(exampleMessages),
    queryKey: ["messages"],
  });
  const [currentMessage, setCurrentMessage] = useState("");
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (messagesQuery.isLoading) return;
    const timeout = setTimeout(() => textInputRef.current?.focus(), 100);
    return () => timeout && clearTimeout(timeout);
  }, [messagesQuery.isLoading]);

  if (!messagesQuery.data) return <ScreenActivityIndicator />;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colorTheme.background.primary }]}>
      <KeyboardAvoidingView style={styles.screen} behavior={"padding"}>
        <LegendList
          data={messagesQuery.data}
          renderItem={({ item }) => {
            const isSender = item.sender === "You";
            return (
              <View style={[styles.messageContainer, { alignSelf: isSender ? "flex-end" : "flex-start" }]}>
                <ChatMessage message={item} />
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10 }}
          recycleItems={true}
          initialScrollIndex={messagesQuery.data.length - 1}
          alignItemsAtEnd // Aligns to the end of the screen, so if there's only a few items there will be enough padding at the top to make them appear to be at the bottom.
          maintainScrollAtEnd // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
          maintainScrollAtEndThreshold={0.5} // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
          maintainVisibleContentPosition //Automatically adjust item positions when items are added/removed/resized above the viewport so that there is no shift in the visible content.
          // getEstimatedItemSize={(info) => { // use if items are different known sizes
          //   console.log("info", info);
          // }}
        />
        <View style={styles.inputSectionContainer}>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colorTheme.background.elevated,
                borderColor: colorTheme.text.primary,
              },
            ]}
          >
            <TextInput
              ref={textInputRef}
              placeholder="Type a message"
              style={[styles.input, { color: colorTheme.text.primary }]}
              placeholderTextColor={colorTheme.text.secondary}
              multiline
              value={currentMessage}
              onChangeText={setCurrentMessage}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colorTheme.background.card }]}
            onPress={() => console.log(currentMessage)}
          >
            <SearchIconSvg style={styles.svgIcon} stroke={colorTheme.text.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  messageContainer: {
    maxWidth: "85%",
    padding: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  inputSectionContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 1,
    borderRadius: 20,
  },
  input: {
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sendButton: {
    width: 50,
    height: 50,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  svgIcon: {
    width: 32,
    height: 32,
  },
});
