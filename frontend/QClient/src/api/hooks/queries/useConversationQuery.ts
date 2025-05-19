import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "src/context/AuthContext";
import { api } from "../..";
import { Message, MessageDto } from "../../types/Message";
import axios from "axios";
import { Product } from "src/api/types/Product";
import useProductsQuery from "./useProductsQuery";

function processMessageDto(dto: MessageDto, products: Product[]): Message {
  const message: Message = {
    ...dto,
    productIds: [],
    conversationId: dto.conversation_id,
    timestamp: new Date(dto.timestamp * 1000),
  };
  if (dto.role === "user" || dto.message[0] !== "*") return message;

  let start = 0;
  let next = dto.message.indexOf("*", start + 1);

  // parse product names between asterisks
  while (next !== -1) {
    const productName = dto.message.substring(start + 1, next);
    const productId = products.find((product) => product.name === productName)?.id;
    if (productId) {
      if (!message.productIds.includes(productId)) {
        message.productIds.push(productId);
      }
    }
    start = next;
    next = dto.message.indexOf("*", start + 1);
  }

  // remove leading spaces before the last asterisk
  while (start !== -1 && (dto.message[start] === " " || dto.message[start] === "*")) {
    ++start;
  }

  message.message = dto.message.substring(start);
  return message;
}

export function useConversationQuery() {
  const accountId = useAuthContext().account?.id;
  if (!accountId) throw new Error("Account ID is required");

  const productsQuery = useProductsQuery();

  return useQuery<Message[], Error>({
    queryFn: async () => {
      if (!productsQuery.data) throw new Error("Products data is required");
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
        .map((hit) => processMessageDto(hit.document, productsQuery.data));
    },
    queryKey: ["messages", accountId],
    gcTime: 0,
    enabled: productsQuery.isSuccess,
  });
}
