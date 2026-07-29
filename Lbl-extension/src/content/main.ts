import type { LearningInteractionResponse } from "../api/DTO/LearningInteractionResponse";
import { Language } from "../domain/language";
import { MessageType } from "../shared/messaging/MessageType";
import type { TranslateTextMessage } from "../shared/messaging/Messages";
import { SelectionPopup } from "./ui/selectionPopup";

let popup: SelectionPopup | undefined;

function getPopup(): SelectionPopup {
    if (!popup) {
        popup = new SelectionPopup();
    }

    return popup;
}

async function sendSelectedTextToBackground(selectedText: string, popup: SelectionPopup) {
    const message: TranslateTextMessage = {
        type: MessageType.TRANSLATE_TEXT,
        selectedText,
        sourceLanguage: Language.ENGLISH,
        targetLanguage: Language.PORTUGUESE,
    };

    popup.showLoading();

    try {
        const response: LearningInteractionResponse = await browser.runtime.sendMessage(message);

        if (response.errorMessage) {
            popup.showError(response.errorMessage);
            return;
        }

        popup.showTranslationPopup({
            ...response,
            originalText: response.originalText ?? selectedText,
        });

    } catch (error) {
        popup.showError(error instanceof Error ? error.message : "Falha ao traduzir o texto selecionado.");
    }
}

async function onMouseUp() {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selectedText) {
        getPopup().hide();
        return;
    }

    const popup = getPopup();
    const rect = selection?.rangeCount ? selection.getRangeAt(0).getBoundingClientRect() : undefined;

    if (rect) {
        popup.showSelectionPopup(rect.left, rect.bottom);
    }

    await sendSelectedTextToBackground(selectedText, popup);
}

function main() {
    document.addEventListener("mouseup", () => {
        void onMouseUp();
    });

    console.log("Content Script iniciado");
}

main();