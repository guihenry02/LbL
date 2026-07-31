export class ReadingSessionStorage {

    private static readonly READING_SESSION_KEY = "readingSessionId";

    public async load(): Promise<string | null> {
        const result = await browser.storage.local.get(ReadingSessionStorage.READING_SESSION_KEY);
        return result[ReadingSessionStorage.READING_SESSION_KEY] ?? null;
    }

    public async save(sessionId: string): Promise<void> {
        await browser.storage.local.set({ [ReadingSessionStorage.READING_SESSION_KEY]: sessionId });
    }

    public async remove(): Promise<void> {
        await browser.storage.local.remove(ReadingSessionStorage.READING_SESSION_KEY);
    }

}

export const readingSessionStorage = new ReadingSessionStorage();