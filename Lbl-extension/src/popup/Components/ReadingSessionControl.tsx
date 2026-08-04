import { useReadingSession } from "../Hooks/UseReadingSession";
import "./popup.css";

function ReadingSessionControl() {
    const { startReadingSession, finishReadingSession, readingSession, loading, error } = useReadingSession();

    const hasActiveSession = readingSession !== null;
    const sessionId = readingSession?.ReadingSessionId;

    return (
        <section className="popup-shell">
            <header className="popup-header">
                <p className="popup-eyebrow">Language Learning</p>
                <h2>Reading session</h2>
                <p className="popup-description">
                    {loading
                        ? "Atualizando o estado da sessão."
                        : error
                            ? "Erro ao processar sessão."
                            : hasActiveSession
                                ? "Uma sessão está aberta e pronta para ser finalizada."
                                : "Nenhuma sessão ativa no momento."}
                </p>
            </header>

            {loading ? (
                <div className="popup-loading" aria-live="polite" aria-busy="true">
                    <div className="popup-spinner" aria-hidden="true" />
                    <span>Carregando estado da sessão...</span>
                </div>
            ) : error ? (
                <div className="popup-error" aria-live="assertive">
                    <p><strong>Erro:</strong> {error}</p>
                </div>
            ) : hasActiveSession ? (
                <div className="popup-card popup-card-active">
                    <div className="popup-card-copy">
                        <span className="popup-status-label">Sessão ativa</span>
                        <strong>{sessionId}</strong>
                        <p>Finalize a sessão quando terminar a leitura.</p>
                    </div>

                    <button
                        type="button"
                        className="popup-button popup-button-danger"
                        onClick={finishReadingSession}
                    >
                        Finalizar sessão
                    </button>
                </div>
            ) : (
                <div className="popup-card popup-card-idle">
                    <div className="popup-card-copy">
                        <span className="popup-status-label">Sem sessão ativa</span>
                        <p>Inicie uma nova sessão para acompanhar sua leitura.</p>
                    </div>

                    <button
                        type="button"
                        className="popup-button popup-button-primary"
                        onClick={startReadingSession}
                    >
                        Criar sessão
                    </button>
                </div>
            )}
        </section>
    );
}

export default ReadingSessionControl;
