export const MessageType = {
  TRANSLATE_TEXT: "TRANSLATE_TEXT",
} as const;

// Create a type alias matching the values ("PING")
export type MessageType = typeof MessageType[keyof typeof MessageType];