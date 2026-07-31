import type { ReadingSessionResponse } from "../DTO/ReadingSessionResponse";


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
        return responseData as ReadingSessionResponse;
    }

    public async finishReadingSession(sessionId: string): Promise<ReadingSessionResponse> {
        const response = await fetch(`${this.BASE_URL}${this.READING_SESSION}/${sessionId}`, {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error(`Failed to finish reading session: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData as ReadingSessionResponse;
    }

}

export const readingSessionClient = new ReadingSessionClient("http://localhost:8081");
