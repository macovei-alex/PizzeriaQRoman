import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "src/context/AuthContext";
import { api } from "../..";
import { Message, MessageDto } from "../../types/Message";
import axios from "axios";

export function useConversationQuery() {
  const accountId = useAuthContext().account?.id;
  if (!accountId) throw new Error("Account ID is required");

  return useQuery<Message[], Error>({
    queryFn: async () => {
      const response = await api.axios.get<{ hits: { document: MessageDto }[] }>(
        api.routes.account(accountId).search.history
      );
      if (response.status === axios.HttpStatusCode.NoContent) return [];
      return response.data.hits
        .sort((dto1, dto2) => {
          const deltaTimestamp = dto1.document.timestamp - dto2.document.timestamp;
          if (deltaTimestamp !== 0) return deltaTimestamp;
          return dto1.document.role === "user" ? -1 : 1;
        })
        .map((hit) => ({
          ...hit.document,
          conversationId: hit.document.conversation_id,
          timestamp: new Date(hit.document.timestamp * 1000),
        }));
    },
    queryKey: ["messages", accountId],
    gcTime: 0,
  });
}
