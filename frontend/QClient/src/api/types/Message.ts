export type MessageRole = "user" | "assistant";

export type MessageDto = {
  id: string;
  conversation_id: string;
  role: MessageRole;
  message: string;
  timestamp: number;
};

export type Message = {
  id: string;
  conversationId: string;
  role: MessageRole;
  message: string;
  timestamp: Date;
};
