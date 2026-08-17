import ReadingSessionControl from "./Components/ReadingSessionControl";

function openPdfReader(): void {
    void browser.tabs.create({ url: browser.runtime.getURL("src/reader/index.html") });
}

function App() {
    return (
        <div className="app">
            <h1>Language Learning</h1>
            <ReadingSessionControl />
            <section className="popup-shell">
                <header className="popup-header">
                    <p className="popup-eyebrow">Reader</p>
                    <h2>Leitor de PDF</h2>
                    <p className="popup-description">
                        Abra um PDF em uma nova aba para ler e traduzir trechos do texto.
                    </p>
                </header>

                <div className="popup-card popup-card-idle">
                    <div className="popup-card-copy">
                        <span className="popup-status-label">PDF</span>
                        <p>Escolha um arquivo PDF com camada de texto.</p>
                    </div>

                    <button
                        type="button"
                        className="popup-button popup-button-primary"
                        onClick={openPdfReader}
                    >
                        Open PDF
                    </button>
                </div>
            </section>
        </div>
    );
}

export default App;
