import { learningInteractionClient } from "../api/LearningInteraction/client/LearningInteractionClient";
import type { LearningInteractionResponse } from "../api/LearningInteraction/DTO/LearningInteractionResponse";
import { toLearningInteractionRequest } from "../api/LearningInteraction/mapper/LearningInteractionMapper";
import { readingSessionClient } from "../api/ReadingSession/client/ReadingSessionClient";
import type { ReadingSessionResponse } from "../api/ReadingSession/DTO/ReadingSessionResponse";
import type { TranslateTextMessage, Message, FinishReadingSessionMessage, GetReadingSessionMessage } from "../shared/messaging/Messages";
import { MessageType } from "../shared/messaging/MessageType";
import { readingSessionStorage } from "../storage/ReadingSessionStorage";

async function handleMessage(message: Message): Promise<LearningInteractionResponse | ReadingSessionResponse> {

    switch (message.type) {
        case MessageType.TRANSLATE_TEXT:
            return handleTranslateText(message as TranslateTextMessage);
        
        case MessageType.CREATE_READING_SESSION:
            return handleCreateReadingSession();

        case MessageType.FINISH_READING_SESSION:
            return handleFinishReadingSession((message as FinishReadingSessionMessage).sessionId);
        case MessageType.GET_READING_SESSION:
            return handleGetReadingSession((message as GetReadingSessionMessage).sessionId);
        default:
            throw new Error(`Unknown message type`);
    }
   
}

async function handleGetReadingSession(sessionId: string): Promise<ReadingSessionResponse> {

    const response = await readingSessionClient.getReadingSession(sessionId);
    return response;
}

async function handleFinishReadingSession(sessionId: string): Promise<ReadingSessionResponse> {

    const response = await readingSessionClient.finishReadingSession(sessionId);
    await readingSessionStorage.remove();
    return response;
}

async function handleTranslateText(message: TranslateTextMessage): Promise<LearningInteractionResponse> {
    
    console.log("Handling translate text. Current message sessionId:", message.sessionId);
    
    if (!message.sessionId) {
        message.sessionId = await readingSessionStorage.load() ?? undefined;
        console.log("Loaded sessionId from storage:", message.sessionId);
    }
 
    const request = toLearningInteractionRequest(message);
    console.log("Request being sent to backend:", request);
    
    const response = await learningInteractionClient.createLearningInteraction(request);

    return response;

}

async function handleCreateReadingSession(): Promise<ReadingSessionResponse> {
    
    const response = await readingSessionClient.createReadingSession();
    console.log("Created reading session, response:", response);
    
    await readingSessionStorage.save(response.ReadingSessionId);
    console.log("Saved sessionId to storage:", response.ReadingSessionId);
    
    return response;

}

browser.runtime.onMessage.addListener((message) => {
    return handleMessage(message as Message);
});

