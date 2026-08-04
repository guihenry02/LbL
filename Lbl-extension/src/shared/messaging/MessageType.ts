export const MessageType = {
  TRANSLATE_TEXT: "TRANSLATE_TEXT",
  CREATE_READING_SESSION: "CREATE_READING_SESSION",
  FINISH_READING_SESSION: "FINISH_READING_SESSION",
  GET_READING_SESSION: "GET_READING_SESSION",
} as const;

// Create a type alias matching the values ("PING")
export type MessageType = typeof MessageType[keyof typeof MessageType];