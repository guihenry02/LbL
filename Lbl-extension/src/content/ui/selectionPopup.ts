import type { LearningInteractionResponse } from "../../api/DTO/LearningInteractionResponse";
import popupStyles from "./selection-popup.css?raw";

export class SelectionPopup {

    private readonly host: HTMLDivElement;
    private readonly shadowRoot: ShadowRoot;
    private readonly container: HTMLDivElement;
    private readonly title: HTMLDivElement;
    private readonly body: HTMLDivElement;
    private readonly translateButton: HTMLButtonElement;
    private readonly closeButton: HTMLButtonElement;
    private selectedText = "";
    private onTranslateRequested: ((selectedText: string) => void | Promise<void>) | undefined;


    constructor() {
        this.host = document.createElement('div');
        this.shadowRoot = this.host.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');

        this.host.id = 'lbl-selection-popup-host';
        this.container.className = 'popup';
        this.container.innerHTML = this.renderShell();

        const styles = document.createElement('style');
        styles.textContent = popupStyles;

        this.shadowRoot.appendChild(styles);
        this.shadowRoot.appendChild(this.container);

        this.body = this.container.querySelector('.popup__body') as HTMLDivElement;
        this.title = this.container.querySelector('.popup__title') as HTMLDivElement;
        this.translateButton = this.container.querySelector('.popup__translate') as HTMLButtonElement;
        this.closeButton = this.container.querySelector('.popup__close') as HTMLButtonElement;

        this.translateButton.addEventListener('click', () => {
            if (!this.selectedText) {
                return;
            }

            void this.onTranslateRequested?.(this.selectedText);
        });

        this.closeButton.addEventListener('click', () => this.hide());

        const mountTarget = document.body ?? document.documentElement;
        mountTarget.appendChild(this.host);

        this.renderShellState();

    }

    showSelection(x: number, y: number): void {
        this.container.style.left = `${x}px`;
        this.container.style.top = `${8 + y}px`;
        this.container.style.display = 'block';
    }

    showSelectionPopup(x: number, y: number): void {
        this.showSelection(x, y);
    }

    setSelectedText(selectedText: string): void {
        this.selectedText = selectedText;
        this.renderSelection();
    }

    setOnTranslateRequested(handler: (selectedText: string) => void | Promise<void>): void {
        this.onTranslateRequested = handler;
    }

    hide(): void {
        this.container.style.display = 'none';
    }

    showTranslationPopup(message: LearningInteractionResponse): void {
        this.renderTranslation(message);
        this.container.style.display = 'block';
    }

    showLoading(): void {
        this.renderLoading();
        this.container.style.display = 'block';
    }

    showError(message: string): void {
        this.renderError(message);
        this.container.style.display = 'block';
    }

    private readSelection(): string {
        return window.getSelection()?.toString().trim() ?? '';
    }

    private renderShell(): string {
        return `
            <div class="popup__header">
                <div class="popup__title">Tradução</div>
                <div class="popup__header-actions">
                    <button class="popup__translate" type="button">Traduzir</button>
                    <button class="popup__close" type="button" aria-label="Fechar popup">&times;</button>
                </div>
            </div>
            <div class="popup__body"></div>
        `;
    }

    private renderShellState(): void {
        this.title.textContent = 'Tradução';
        this.translateButton.disabled = !this.selectedText;
        this.body.innerHTML = `
            <div class="popup__status">
                <span>Selecione um texto e clique em Traduzir.</span>
            </div>
        `;
    }

    private renderSelection(): void {
        this.title.textContent = 'Tradução';
        this.translateButton.disabled = !this.selectedText;

        this.body.innerHTML = `
            <div class="popup__selection-label">Texto selecionado</div>
            <div class="popup__selection">${this.escapeHtml(this.selectedText || 'Nenhum texto selecionado')}</div>
        `;
    }

    private renderLoading(): void {
        this.title.textContent = 'Tradução';
        this.translateButton.disabled = true;
        this.body.innerHTML = `
            <div class="popup__status">
                <span class="popup__spinner" aria-hidden="true"></span>
                <span>Traduzindo texto selecionado...</span>
            </div>
        `;
    }

    private renderTranslation(message: LearningInteractionResponse): void {
        const translatedText = message.translatedText?.trim() || 'Nenhuma tradução retornada.';
        const originalText = message.originalText?.trim() ?? this.readSelection();
        const targetLanguage = message.targetLanguage ?? 'tradução';

        this.title.textContent = `Tradução para ${String(targetLanguage).toLowerCase()}`;
        this.translateButton.disabled = false;
        this.body.innerHTML = `
            ${originalText ? `
                <div class="popup__original-label">Texto original</div>
                <div class="popup__original">${this.escapeHtml(originalText)}</div>
            ` : ''}
            <div class="popup__translation-label">Resultado</div>
            <div class="popup__translation">${this.escapeHtml(translatedText)}</div>
        `;
    }

    private renderError(message: string): void {
        this.title.textContent = 'Erro na tradução';
        this.translateButton.disabled = false;
        this.body.innerHTML = `
            <div class="popup__error-label">Não foi possível traduzir</div>
            <div class="popup__error">${this.escapeHtml(message)}</div>
        `;
    }

    private escapeHtml(value: string): string {
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }
}