export type Message = {
  id: string;
  sender: "You" | "Bot";
  content: string;
  createdAt: Date;
};
