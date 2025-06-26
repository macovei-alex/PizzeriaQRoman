import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import GoBackButtonSvg from "src/components/svg/GoBackButtonSvg";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "src/context/AuthContext";
import { api } from "src/api";
import { Message } from "src/api/types/Message";
import logger from "src/utils/logger";

export default function TopBar() {
  logger.render("TopBar");

  const { theme } = useUnistyles();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const accountId = useAuthContext().account?.id;
  if (!accountId) throw new Error("Account ID is required");

  const handleDeleteConversation = async () => {
    const messages = queryClient.getQueryData<Message[]>(["messages", accountId]);
    if (!messages || messages.length === 0) return;

    Alert.alert("Sigur doriți să ștergeți conversația?", "", [
      { text: "Anulează", style: "cancel" },
      {
        text: "Șterge",
        style: "destructive",
        onPress: () => {
          queryClient.setQueryData<Message[]>(["messages", accountId], () => []);
          api.axios
            .delete(api.routes.account(accountId).searches)
            .then(() => queryClient.invalidateQueries({ queryKey: ["messages", accountId] }))
            .catch((error) => logger.error(error.message));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.svgContainer} onPress={() => navigation.goBack()}>
        <GoBackButtonSvg style={styles.goBackButton} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.svgContainer} onPress={handleDeleteConversation}>
        <FontAwesome name="trash-o" size={24} color={theme.text.accent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    padding: 12,
    paddingRight: 16,
    borderColor: theme.text.primary,
  },
  svgContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  goBackButton: {
    width: 40,
    height: 40,
  },
}));
