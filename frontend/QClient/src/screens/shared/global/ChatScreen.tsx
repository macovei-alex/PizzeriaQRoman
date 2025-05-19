import { LegendList, LegendListRef } from "@legendapp/list";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Message } from "src/api/types/Message";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import ChatMessage from "src/components/shared/global/ChatMessage/ChatMessage";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import { useConversationQuery } from "src/api/hooks/queries/useConversationQuery";
import { useAuthContext } from "src/context/AuthContext";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import { useConversationMutation } from "src/api/hooks/mutations/useConversationMutation";

export default function ChatScreen() {
  logger.render("ChatScreen");

  const colorTheme = useColorTheme();
  const accountId = useAuthContext().account?.id;
  if (!accountId) throw new Error("Account ID is required");
  const conversationQuery = useConversationQuery();
  const conversationMutation = useConversationMutation();
  const [currentMessage, setCurrentMessage] = useState("");
  const textInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<LegendListRef>(null);

  useEffect(() => {
    if (conversationQuery.isLoading) return;
    const timeout = setTimeout(() => textInputRef.current?.focus(), 100);
    return () => clearTimeout(timeout);
  }, [conversationQuery.isLoading]);

  useEffect(() => {
    if (!conversationQuery.isPending || conversationMutation.isPending) {
      scrollViewRef.current?.scrollToOffset({
        offset: 9999,
        animated: true,
      });
    }
  }, [conversationQuery.isPending, conversationMutation.isPending]);

  const handleSendMessage = () => {
    textInputRef.current?.blur();
    if (currentMessage === "") return;
    const newMessage: Message = {
      id: "temporary id",
      conversationId: "temporary conversationId",
      role: "user",
      message: currentMessage,
      timestamp: new Date(),
    };

    conversationMutation.mutate(newMessage);
    setCurrentMessage("");
  };

  const messages = useMemo(() => {
    if (!conversationQuery.data) return [];
    if (!conversationMutation.isPending) return conversationQuery.data;
    return [
      ...conversationQuery.data,
      {
        id: "temporary id 2",
        conversationId: "temporary conversationId",
        role: "assistant",
        message: "...",
        timestamp: new Date(),
      } as Message,
    ];
  }, [conversationQuery.data, conversationMutation.isPending]);

  if (conversationQuery.isLoading) return <ScreenActivityIndicator />;
  if (conversationQuery.isError || !conversationQuery.data) return <ErrorComponent />;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colorTheme.background.primary }]}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.select({ ios: "padding", default: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 100, default: 0 })}
      >
        <LegendList
          data={messages}
          ref={scrollViewRef}
          renderItem={({ item, index }) => {
            const isUser = item.role === "user";
            return (
              <View style={[styles.messageContainer, { alignSelf: isUser ? "flex-end" : "flex-start" }]}>
                <ChatMessage
                  message={item}
                  isThinking={index === messages.length - 1 && conversationQuery.isFetching}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
          recycleItems={true}
          initialScrollOffset={9999}
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
              placeholder="Scrie un mesaj..."
              style={[styles.input, { color: colorTheme.text.primary }]}
              placeholderTextColor={colorTheme.text.secondary}
              multiline
              value={currentMessage}
              onChangeText={setCurrentMessage}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colorTheme.background.card }]}
            onPress={handleSendMessage}
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
    padding: 8,
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
