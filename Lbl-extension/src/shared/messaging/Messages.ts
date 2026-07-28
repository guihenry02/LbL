import { MessageType } from "./MessageType";
import { Language } from "../../domain/language";

export type TranslateTextMessage = {
  type: typeof MessageType.TRANSLATE_TEXT;
  selectedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;

};
