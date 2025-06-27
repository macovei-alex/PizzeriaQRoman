import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { api } from "src/api";
import { Message } from "src/api/types/Message";
import { useAuthContext } from "src/context/AuthContext";
import logger from "src/constants/logger";

export function useConversationMutation() {
  const accountId = useAuthContext().account?.id;
  if (!accountId) throw new Error("Account ID is required");
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<Message[], any>, Error, Message, Message[]>({
    mutationFn: async (newMessage) => {
      return api.axios.get<Message[]>(api.routes.account(accountId).searches, {
        timeout: 10000,
        params: {
          q: newMessage.message,
        },
      });
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ["messages", accountId] });
      const previousMessages = queryClient.getQueryData<Message[]>(["messages", accountId]);
      queryClient.setQueryData<Message[]>(["messages", accountId], (old = []) => [...old, newMessage]);
      return previousMessages;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages", accountId] }),
    onError: (error, newMessage, previousMessages) => {
      logger.error(error.message);
      if (previousMessages) {
        queryClient.setQueryData(["messages", accountId], previousMessages);
      }
    },
  });
}
