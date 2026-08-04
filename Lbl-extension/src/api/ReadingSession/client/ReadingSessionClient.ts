import type { ReadingSessionResponse } from "../DTO/ReadingSessionResponse";

function normalizeReadingSessionResponse(responseData: Record<string, unknown>): ReadingSessionResponse {
    const readingSessionId = responseData.id;

    if (typeof readingSessionId !== "string" || readingSessionId.length === 0) {
        throw new Error(`Reading session response does not contain a valid session id. Got: ${JSON.stringify(responseData)}`);
    }

    return {
        ReadingSessionId: readingSessionId,
        CreatedAt: typeof responseData.createdAt === "string" ? responseData.createdAt : undefined,
        FinishedAt: typeof responseData.finishedAt === "string" ? responseData.finishedAt : undefined,
    };
}


class ReadingSessionClient {

    private readonly BASE_URL: string;
    private readonly READING_SESSION = "/reading-session";

    constructor(baseUrl: string) {
        this.BASE_URL = baseUrl;
    }

    public async createReadingSession(): Promise<ReadingSessionResponse> {
        const response = await fetch(`${this.BASE_URL}${this.READING_SESSION}`, {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error(`Failed to create reading session: ${response.statusText}`);
        }

        const responseData = await response.json();
        return normalizeReadingSessionResponse(responseData as Record<string, unknown>);
    }

    public async finishReadingSession(sessionId: string): Promise<ReadingSessionResponse> {
        const response = await fetch(`${this.BASE_URL}${this.READING_SESSION}/${sessionId}/finish`, {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error(`Failed to finish reading session: ${response.statusText}`);
        }

        const responseData = await response.json();
        return normalizeReadingSessionResponse(responseData as Record<string, unknown>);
    }

    public async getReadingSession(sessionId: string): Promise<ReadingSessionResponse> {
        const response = await fetch(`${this.BASE_URL}${this.READING_SESSION}/${sessionId}`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Failed to get reading session: ${response.statusText}`);
        }

        const responseData = await response.json();
        return normalizeReadingSessionResponse(responseData as Record<string, unknown>);
    }

}

export const readingSessionClient = new ReadingSessionClient("http://localhost:8081");
