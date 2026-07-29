import type { LearningInteractionResponse } from "../../api/DTO/LearningInteractionResponse";
import popupStyles from "./selection-popup.css?raw";

export class SelectionPopup {

    private readonly host: HTMLDivElement;
    private readonly shadowRoot: ShadowRoot;
    private readonly container: HTMLDivElement;
    private readonly title: HTMLDivElement;
    private readonly body: HTMLDivElement;
    private readonly closeButton: HTMLButtonElement;


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
        this.closeButton = this.container.querySelector('.popup__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => this.hide());

        const mountTarget = document.body ?? document.documentElement;
        mountTarget.appendChild(this.host);

        this.renderLoading();

    }

    showSelection(x: number, y: number): void {
        this.container.style.left = `${x}px`;
        this.container.style.top = `${8 + y}px`;
        this.container.style.display = 'block';
    }

    showSelectionPopup(x: number, y: number): void {
        this.showSelection(x, y);
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
                <button class="popup__close" type="button" aria-label="Fechar popup">&times;</button>
            </div>
            <div class="popup__body"></div>
        `;
    }

    private renderLoading(): void {
        this.title.textContent = 'Tradução';
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