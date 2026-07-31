export type ReadingSessionState =
    | {
        status: "closed";
    }
    | {
        status: "opening";
    }
    | {
        status: "open";
        sessionId: string;
    }
    | {
        status: "closing";
        sessionId: string;
    }
    | {
        status: "error";
        message: string;
    };