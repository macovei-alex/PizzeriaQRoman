import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Message, MessageRole } from "src/api/types/Message";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";
import ChatMessage from "src/components/shared/global/ChatScreen/ChatMessage";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import logger from "src/utils/logger";
import { useConversationQuery } from "src/api/hooks/queries/useConversationQuery";
import { useAuthContext } from "src/context/AuthContext";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import { useConversationMutation } from "src/api/hooks/mutations/useConversationMutation";
import TopBar from "src/components/shared/global/ChatScreen/TopBar";
import useScrollRef from "src/hooks/useScrollRef";
import ProductLinks from "src/components/shared/global/ChatScreen/ProductLinks";

export default function ChatScreen() {
  logger.render("ChatScreen");

  const { theme } = useUnistyles();

  const accountId = useAuthContext().account?.id;
  if (!accountId) throw new Error("Account ID is required");
  const conversationQuery = useConversationQuery();
  const conversationMutation = useConversationMutation();
  const [currentMessage, setCurrentMessage] = useState("");
  const textInputRef = useRef<TextInput>(null);
  const scrollViewRef = useScrollRef();
  const messageCounter = useRef(10000);

  useEffect(() => {
    if (conversationQuery.isLoading) return;
    const timeout = setTimeout(() => textInputRef.current?.focus(), 100);
    return () => clearTimeout(timeout);
  }, [conversationQuery.isLoading]);

  useEffect(() => {
    scrollViewRef.scrollToEnd();
  }, [conversationQuery.data, scrollViewRef]);

  const generateNewMessage = useCallback(
    (text: string, role: MessageRole) => {
      const newMessage: Message = {
        id: messageCounter.current.toString(),
        conversationId: "temporary conversationId",
        role,
        message: text,
        timestamp: new Date(),
        productIds: [],
      };
      if (conversationQuery.data && conversationQuery.data.length > 0) {
        const lastMessage = conversationQuery.data[conversationQuery.data.length - 1];
        newMessage.id = (Number(lastMessage.id) + 1).toString();
        newMessage.conversationId = lastMessage.conversationId;
      } else {
        messageCounter.current += 1;
      }
      return newMessage;
    },
    [conversationQuery.data]
  );

  const handleSendMessage = () => {
    textInputRef.current?.blur();
    if (currentMessage === "") return;
    conversationMutation.mutate(generateNewMessage(currentMessage, "user"));
    setCurrentMessage("");
  };

  const messages = useMemo(() => {
    if (!conversationQuery.data) return [];
    if (!conversationMutation.isPending) return conversationQuery.data;
    return [...conversationQuery.data, generateNewMessage("...", "assistant")];
  }, [conversationQuery.data, conversationMutation.isPending, generateNewMessage]);

  if (conversationQuery.isLoading) return <ScreenActivityIndicator />;
  if (conversationQuery.isError || !conversationQuery.data) return <ErrorComponent />;

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.select({ ios: "padding", default: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 100, default: 0 })}
      >
        <TopBar />

        <ScrollView ref={scrollViewRef.scrollRef}>
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <View
                key={message.id}
                style={[styles.messageContainer, { alignSelf: isUser ? "flex-end" : "flex-start" }]}
              >
                <View style={styles.messageInnerContainer}>
                  <ChatMessage
                    message={message}
                    isThinking={index === messages.length - 1 && conversationQuery.isFetching}
                  />
                  <ProductLinks productIds={message.productIds} />
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputSectionContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              placeholder="Scrie un mesaj..."
              style={styles.input}
              placeholderTextColor={theme.text.secondary}
              multiline
              value={currentMessage}
              onChangeText={setCurrentMessage}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <SearchIconSvg style={styles.svgIcon} stroke={theme.text.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.background.primary,
  },
  messageContainer: {
    maxWidth: "85%",
    padding: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  messageInnerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
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
    backgroundColor: theme.background.elevated,
    borderColor: theme.text.primary,
  },
  input: {
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: theme.text.primary,
  },
  sendButton: {
    width: 50,
    height: 50,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: theme.background.card,
  },
  svgIcon: {
    width: 32,
    height: 32,
  },
}));
