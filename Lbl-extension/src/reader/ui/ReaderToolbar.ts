export interface ReaderToolbarCallbacks {
    onFileSelected: (file: File) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
}

/**
 * Interface do leitor. Contém apenas: botão para abrir um PDF, controle de
 * zoom e navegação entre páginas.
 */
export class ReaderToolbar {

    private readonly element: HTMLElement;
    private readonly fileInput: HTMLInputElement;

    private readonly openButton: HTMLButtonElement;
    private readonly zoomOutButton: HTMLButtonElement;
    private readonly zoomLabel: HTMLSpanElement;
    private readonly zoomInButton: HTMLButtonElement;
    private readonly zoomResetButton: HTMLButtonElement;
    private readonly previousPageButton: HTMLButtonElement;
    private readonly pageLabel: HTMLSpanElement;
    private readonly nextPageButton: HTMLButtonElement;

    private readonly callbacks: ReaderToolbarCallbacks;

    constructor(callbacks: ReaderToolbarCallbacks) {
        this.callbacks = callbacks;

        this.element = document.createElement("header");
        this.element.className = "reader-toolbar";
        this.element.innerHTML = `
            <div class="reader-toolbar__group">
                <button type="button" class="reader-button reader-button--primary" data-action="open">Open PDF</button>
                <input type="file" accept="application/pdf,.pdf" hidden data-action="file" />
            </div>
            <div class="reader-toolbar__group" role="group" aria-label="Zoom">
                <button type="button" class="reader-button" data-action="zoom-out" aria-label="Diminuir zoom">−</button>
                <span class="reader-toolbar__label" data-action="zoom-label">100%</span>
                <button type="button" class="reader-button" data-action="zoom-in" aria-label="Aumentar zoom">+</button>
                <button type="button" class="reader-button" data-action="zoom-reset" aria-label="Redefinir zoom">Reset</button>
            </div>
            <div class="reader-toolbar__group" role="group" aria-label="Navegação entre páginas">
                <button type="button" class="reader-button" data-action="prev-page" aria-label="Página anterior">←</button>
                <span class="reader-toolbar__label" data-action="page-label">– / –</span>
                <button type="button" class="reader-button" data-action="next-page" aria-label="Próxima página">→</button>
            </div>
        `;

        this.openButton = this.queryButton("open");
        this.fileInput = this.element.querySelector('[data-action="file"]') as HTMLInputElement;
        this.zoomOutButton = this.queryButton("zoom-out");
        this.zoomLabel = this.queryLabel("zoom-label");
        this.zoomInButton = this.queryButton("zoom-in");
        this.zoomResetButton = this.queryButton("zoom-reset");
        this.previousPageButton = this.queryButton("prev-page");
        this.pageLabel = this.queryLabel("page-label");
        this.nextPageButton = this.queryButton("next-page");

        this.openButton.addEventListener("click", () => this.fileInput.click());
        this.fileInput.addEventListener("change", () => {
            const file = this.fileInput.files?.[0];
            if (file) {
                this.callbacks.onFileSelected(file);
            }
            this.fileInput.value = "";
        });

        this.zoomOutButton.addEventListener("click", () => this.callbacks.onZoomOut());
        this.zoomInButton.addEventListener("click", () => this.callbacks.onZoomIn());
        this.zoomResetButton.addEventListener("click", () => this.callbacks.onZoomReset());
        this.previousPageButton.addEventListener("click", () => this.callbacks.onPreviousPage());
        this.nextPageButton.addEventListener("click", () => this.callbacks.onNextPage());
    }

    mount(host: HTMLElement): void {
        host.appendChild(this.element);
    }

    setPageInfo(current: number, total: number): void {
        this.pageLabel.textContent = total > 0 ? `${current} / ${total}` : "– / –";
        this.previousPageButton.disabled = current <= 1;
        this.nextPageButton.disabled = current >= total;
    }

    setZoom(scale: number): void {
        this.zoomLabel.textContent = `${Math.round(scale * 100)}%`;
    }

    setEnabled(enabled: boolean): void {
        this.zoomOutButton.disabled = !enabled;
        this.zoomInButton.disabled = !enabled;
        this.zoomResetButton.disabled = !enabled;

        if (!enabled) {
            this.previousPageButton.disabled = true;
            this.nextPageButton.disabled = true;
        }
    }

    private queryButton(action: string): HTMLButtonElement {
        return this.element.querySelector(`[data-action="${action}"]`) as HTMLButtonElement;
    }

    private queryLabel(action: string): HTMLSpanElement {
        return this.element.querySelector(`[data-action="${action}"]`) as HTMLSpanElement;
    }
}
