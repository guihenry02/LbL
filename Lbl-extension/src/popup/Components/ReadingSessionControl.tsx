import { useReadingSession } from "../Hooks/UseReadingSession";

function ReadingSessionControl() {
    const { isSessionOpen, toggleSessionState } = useReadingSession();

    return (
        <>
            {isSessionOpen ? (
                <div className="reading-session-control">
                    <h2>Active Session</h2>
                    <button id="end-reading-session" onClick={toggleSessionState}>End Reading Session</button>
                </div>
            ) : (
                <div className="reading-session-control">
                    <h2>No active Session</h2>
                    <button id="start-reading-session" onClick={toggleSessionState}>Start Reading Session</button>
                </div>
            )}
        </>
    );  
}

export default ReadingSessionControl;
