import { useState, useEffect } from "react";
import type { ReadingSessionResponse } from "../../api/ReadingSession/DTO/ReadingSessionResponse";
import { MessageType } from "../../shared/messaging/MessageType";
import { readingSessionStorage } from "../../storage/ReadingSessionStorage";

export function useReadingSession() {

    const [readingSession, setReadingSession] = useState<ReadingSessionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadReadingSession() {
            try {
                const sessionId = await readingSessionStorage.load();

                if (!sessionId) {
                    setReadingSession(null);
                    return;
                }

                const response = await browser.runtime.sendMessage({
                    type: MessageType.GET_READING_SESSION,
                    sessionId: sessionId
                });

                setReadingSession(response);
            }
            catch (error) {
                console.error("Failed to load reading session:", error);
                await readingSessionStorage.remove();
                setReadingSession(null);
            }
        }

        void executeWithLoading(loadReadingSession);

    }, [])



    const [error, setError] = useState<string | null>(null);

    // ... (keep loadReadingSession implementation)

    async function executeWithLoading<T>(action: () => Promise<T>): Promise<T> {
        setLoading(true);
        setError(null);

        // Ensure loading is visible for at least 500ms
        const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 500));

        try {
            const [result] = await Promise.all([action(), minLoadingTime]);
            return result;
        } catch (e) {
            const message = e instanceof Error ? e.message : "An unknown error occurred";
            setError(message);
            throw e;
        } finally {
            setLoading(false);
        }
    }

    const startReadingSession = async () => {
        if (readingSession) return;

        try {
            const response = await executeWithLoading(() =>
                browser.runtime.sendMessage({
                    type: MessageType.CREATE_READING_SESSION,
                })
            )
            setReadingSession(response)
        }
        catch (error) {
            console.error("Failed to create reading session:", error);
        }
    }

    const finishReadingSession = async () => {
        if (!readingSession) return;

        try {
            await executeWithLoading(() =>
                browser.runtime.sendMessage({
                    type: MessageType.FINISH_READING_SESSION,
                    sessionId: readingSession.ReadingSessionId
                })
            )
            setReadingSession(null);
        }
        catch (error) {
            console.error("Failed to finish reading session:", error);
        }
    }

    return {
        readingSession,
        startReadingSession,
        finishReadingSession,
        loading,
        error
    };
}