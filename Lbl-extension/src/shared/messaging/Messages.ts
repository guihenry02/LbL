import { MessageType } from "./MessageType";
import { Language } from "../../domain/language";

export type TranslateTextMessage = {
  type: typeof MessageType.TRANSLATE_TEXT;
  selectedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
};

export type CreateReadingSessionMessage = {
  type: typeof MessageType.CREATE_READING_SESSION;
};

export type FinishReadingSessionMessage = {
  type: typeof MessageType.FINISH_READING_SESSION;
  sessionId: string;
};

export type Message = TranslateTextMessage | CreateReadingSessionMessage | FinishReadingSessionMessage;
