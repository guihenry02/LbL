import type { LearningInteractionResponse } from "../api/DTO/LearningInteractionResponse";
import { Language } from "../domain/language";
import { MessageType } from "../shared/messaging/MessageType";
import type { TranslateTextMessage } from "../shared/messaging/Messages";

async function sendSelectedTextToBackground(selectedText: string) {
    const message: TranslateTextMessage = {
        type: MessageType.TRANSLATE_TEXT,
        selectedText,
        sourceLanguage: Language.ENGLISH,
        targetLanguage: Language.PORTUGUESE,
    };

    try {
        const response: LearningInteractionResponse = await browser.runtime.sendMessage(message);
        console.log(response.translatedText);

    } catch (error) {
        console.error("Failed to send message to background:", error);
    }
}

async function onMouseUp() {
    const selectedText = window.getSelection()?.toString().trim();

    if (!selectedText) {
        return;
    }

    await sendSelectedTextToBackground(selectedText);
}

function main() {
    document.addEventListener("mouseup", () => {
        void onMouseUp();
    });

    console.log("Content Script iniciado");
}

main();