import { learningInteractionClient } from "../api/LearningInteraction/client/LearningInteractionClient";
import type { LearningInteractionResponse } from "../api/LearningInteraction/DTO/LearningInteractionResponse";
import { toLearningInteractionRequest } from "../api/LearningInteraction/mapper/LearningInteractionMapper";
import { readingSessionClient } from "../api/ReadingSession/client/ReadingSessionClient";
import type { ReadingSessionResponse } from "../api/ReadingSession/DTO/ReadingSessionResponse";
import type { TranslateTextMessage, Message, FinishReadingSessionMessage } from "../shared/messaging/Messages";
import { MessageType } from "../shared/messaging/MessageType";

async function handleMessage(message: Message): Promise<LearningInteractionResponse | ReadingSessionResponse> {

    switch (message.type) {
        case MessageType.TRANSLATE_TEXT:
            return handleTranslateText(message as TranslateTextMessage);
        
        case MessageType.CREATE_READING_SESSION:
            return handleRequestReadingSession();

        case MessageType.FINISH_READING_SESSION:
            return handleFinishReadingSession((message as FinishReadingSessionMessage).sessionId);
        default:
            throw new Error(`Unknown message type`);
    }
   
}


async function handleFinishReadingSession(sessionId: string): Promise<ReadingSessionResponse> {

    const response = await readingSessionClient.finishReadingSession(sessionId);
    return response;
}

async function handleTranslateText(message: TranslateTextMessage): Promise<LearningInteractionResponse> {
    
    const request = toLearningInteractionRequest(message);
    
    const response = await learningInteractionClient.createLearningInteraction(request);

    return response;

}

async function handleRequestReadingSession(): Promise<ReadingSessionResponse> {
    
    const response = await readingSessionClient.createReadingSession();

    return response;

}

browser.runtime.onMessage.addListener((message) => {
    return handleMessage(message as Message);
});

