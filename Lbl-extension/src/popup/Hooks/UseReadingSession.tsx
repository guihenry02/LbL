import { useState, useEffect } from "react";
import type { ReadingSessionResponse } from "../../api/ReadingSession/DTO/ReadingSessionResponse";

export function useReadingSession() {

    const [readingSession, setReadingSession] = useState<ReadingSessionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

/*
    StartReadingSession: Verificar se a sessão de leitura já está ativa. Se não estiver, transita o estado para loading e 
    iniciaa uma nova sessão de leitura e atualiza o estado da sessão de leitura. Se já estiver ativa, não fazer nada.
*/
    const startReadingSession = async () => {

        if (readingSession) {
            return
        }

        setLoading(true);
        const response = await browser.runtime.sendMessage({ type: "START_READING_SESSION" });
        if (response) {
            setReadingSession(response);
        }
        setLoading(false);

    }

    /*
    FinishReadingSession: Verificar se a sessão de leitura está ativa. Se estiver, transita o estado para loading e
    finaliza a sessão de leitura e atualiza o estado da sessão de leitura. Se não estiver ativa, não fazer nada.
    */

    const finishReadingSession = async () => {
        if (!readingSession) {
            return
        }

        setLoading(true);
        const response = await browser.runtime.sendMessage({ type: "FINISH_READING_SESSION", sessionId: readingSession.ReadingSessionId });
        if (response) {
            setReadingSession(null);
        }
        setLoading(false);
    }

    return {
        readingSession,
        startReadingSession,
        finishReadingSession,
        loading
    };
}