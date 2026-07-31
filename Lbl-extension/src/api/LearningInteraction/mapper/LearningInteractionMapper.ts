import type { TranslateTextMessage } from "../../../shared/messaging/Messages";
import type { LearningInteractionRequest } from "../DTO/LearningInteractionRequest";

export function toLearningInteractionRequest(message: TranslateTextMessage): LearningInteractionRequest {
    return {
        selectedText: message.selectedText,
        nativeLanguage: message.sourceLanguage,
        targetLanguage: message.targetLanguage,
    };
}
