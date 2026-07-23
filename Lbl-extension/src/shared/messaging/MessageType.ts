export const MessageType = {
  PING: "PING",
} as const;

// Create a type alias matching the values ("PING")
export type MessageType = typeof MessageType[keyof typeof MessageType];