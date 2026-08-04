export interface ReadingSessionResponse {
    ReadingSessionId: string; // UUID v4 (ex: generated with `uuid` package)
    CreatedAt?: string; // ISO 8601 date string
    FinishedAt?: string; // ISO 8601 date string
}