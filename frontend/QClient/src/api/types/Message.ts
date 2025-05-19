export type MessageDto = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  message: string;
  timestamp: number;
};

export type Message = {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  message: string;
  timestamp: Date;
};
