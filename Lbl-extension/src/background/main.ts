import { learningInteractionClient } from "../api/client/LearningInteractionClient";
import type { LearningInteractionResponse } from "../api/DTO/LearningInteractionResponse";
import { toLearningInteractionRequest } from "../api/mapper/ LearningInteractionMapper";
import type { TranslateTextMessage } from "../shared/messaging/Messages";
import { MessageType } from "../shared/messaging/MessageType";

async function handleMessage(message: TranslateTextMessage): Promise<LearningInteractionResponse> {

    switch (message.type) {
        case MessageType.TRANSLATE_TEXT:
            return handleTranslateText(message);

        default:
            throw new Error(`Unknown message type: ${message.type}`);
    }
   
}




async function handleTranslateText(message: TranslateTextMessage): Promise<LearningInteractionResponse> {
    
    const request = toLearningInteractionRequest(message);
    
    const response = await learningInteractionClient.createLearningInteraction(request);

    return response;

}

browser.runtime.onMessage.addListener((message) => {
    return handleMessage(message as TranslateTextMessage);
});