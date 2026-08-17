import type { PDFDocumentProxy, PageViewport } from "pdfjs-dist";
import type { LearningInteractionResponse } from "../../api/LearningInteraction/DTO/LearningInteractionResponse";
import { SelectionPopup } from "../../content/ui/selectionPopup";
import { Language } from "../../domain/language";
import type { TranslateTextMessage } from "../../shared/messaging/Messages";
import { MessageType } from "../../shared/messaging/MessageType";
import { PdfDocumentLoader } from "../pdf/PdfDocumentLoader";
import { PdfRenderer } from "../pdf/PdfRenderer";
import { PdfTextLayer } from "../pdf/PdfTextLayer";
import { SelectionManager } from "../selection/SelectionManager";
import { ReaderContainer } from "../ui/ReaderContainer";
import { ReaderToolbar } from "../ui/ReaderToolbar";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.25;
const CONTAINER_PADDING = 48;
/** Número de páginas renderizadas antes/depois da página visível. */
const RENDER_MARGIN = 2;

/**
 * Componente principal do leitor. Orquestra a interação entre a interface
 * (toolbar/container), o carregamento do documento e a renderização das
 * páginas, e conecta a seleção de texto ao pipeline de tradução já existente
 * (SelectionPopup -> TranslateTextMessage -> Background).
 *
 * A renderização é sob demanda: apenas a página visível (e uma margem ao redor)
 * possui canvas + TextLayer no DOM. Páginas que saem dessa janela têm seu
 * conteúdo removido (e seus recursos liberados via page.cleanup()), limitando
 * o consumo de memória em documentos grandes.
 */
export class PdfReaderPage {

    private readonly container: ReaderContainer;
    private readonly toolbar: ReaderToolbar;
    private readonly popup: SelectionPopup;

    private readonly documentLoader = new PdfDocumentLoader();
    private readonly pageRenderer = new PdfRenderer();
    private readonly textLayerRenderer = new PdfTextLayer();
    private readonly selectionManager = new SelectionManager();

    private pdfDocument: PDFDocumentProxy | null = null;
    private scale = 1;
    private pageNumber = 1;

    /** Viewports base (scale 1) de cada página; a escala é aplicada via clone(). */
    private baseViewports: PageViewport[] = [];
    /** Páginas que atualmente possuem canvas + TextLayer no DOM. */
    private renderedPages = new Set<number>();
    /** Token de invalidação: incrementado a cada zoom/mudança de documento para descartar renders obsoletos. */
    private renderEpoch = 0;

    constructor(root: HTMLElement) {
        root.classList.add("reader");

        this.toolbar = new ReaderToolbar({
            onFileSelected: (file) => {
                void this.openDocument(file);
            },
            onZoomIn: () => {
                void this.changeZoom(this.scale + ZOOM_STEP);
            },
            onZoomOut: () => {
                void this.changeZoom(this.scale - ZOOM_STEP);
            },
            onZoomReset: () => {
                void this.changeZoom(1);
            },
            onPreviousPage: () => this.goToPage(this.pageNumber - 1),
            onNextPage: () => this.goToPage(this.pageNumber + 1),
        });
        this.toolbar.mount(root);

        const containerElement = document.createElement("div");
        containerElement.className = "reader-container";
        this.container = new ReaderContainer(containerElement);
        this.container.mount(root);
        this.container.onScroll(() => this.updateVisiblePage());

        this.popup = new SelectionPopup();
        this.popup.setOnTranslateRequested((selectedText) => {
            void this.requestTranslation(selectedText);
        });

        document.addEventListener("mouseup", this.handleMouseUp);

        this.toolbar.setEnabled(false);
    }

    private readonly handleMouseUp = (): void => {
        const selection = this.selectionManager.capture();

        if (!selection) {
            this.popup.hide();
            return;
        }

        this.popup.setSelectedText(selection.text);
        this.popup.showSelectionPopup(selection.rect.left, selection.rect.bottom);
    };

    private async openDocument(file: File): Promise<void> {
        this.toolbar.setEnabled(false);
        this.container.showStatus("Carregando PDF...");

        try {
            if (this.pdfDocument) {
                this.pageRenderer.cancelAll();
                this.textLayerRenderer.cancelAll();
                await this.pdfDocument.loadingTask.destroy();
                this.pdfDocument = null;
            }

            const document = await this.documentLoader.load(file);
            this.pdfDocument = document;

            this.pageNumber = 1;
            this.scale = await this.computeFitScale(document);
            this.toolbar.setZoom(this.scale);

            await this.buildPageShells();
            await this.renderPageWindow(1);
            this.scrollToPage(1);

            this.toolbar.setPageInfo(1, document.numPages);
            this.toolbar.setEnabled(true);
        } catch (error) {
            this.container.showStatus(this.formatError(error));
        }
    }

    private async computeFitScale(document: PDFDocumentProxy): Promise<number> {
        const firstPage = await document.getPage(1);
        const baseViewport = firstPage.getViewport({ scale: 1 });
        const availableWidth = Math.max(this.container.contentWidth - CONTAINER_PADDING, 100);

        return Math.min(Math.max(availableWidth / baseViewport.width, MIN_SCALE), MAX_SCALE);
    }

    /**
     * Cria os shells (contêineres vazios, do tamanho exato do viewport) de
     * todas as páginas — baratos em DOM e necessários para a barra de rolagem
     * correta. Canvas e TextLayer só são renderizados sob demanda.
     */
    private async buildPageShells(): Promise<void> {
        const document = this.pdfDocument;
        if (!document) {
            return;
        }

        this.container.clear();
        this.renderedPages.clear();
        this.renderEpoch += 1;
        this.baseViewports = [];
        this.container.setScale(this.scale);

        const pages = await Promise.all(
            Array.from({ length: document.numPages }, (_, index) => document.getPage(index + 1)),
        );

        for (const page of pages) {
            const baseViewport = page.getViewport({ scale: 1 });
            this.baseViewports.push(baseViewport);
            const shell = this.container.createPageShell(baseViewport.clone({ scale: this.scale }));
            this.container.appendPageShell(shell);
        }
    }

    /**
     * Garante que as páginas da janela [center - margem, center + margem]
     * estejam renderizadas e que páginas fora dela tenham seu conteúdo removido.
     */
    private async renderPageWindow(centerPage: number): Promise<void> {
        const document = this.pdfDocument;
        if (!document) {
            return;
        }

        const epoch = this.renderEpoch;
        const first = Math.max(1, centerPage - RENDER_MARGIN);
        const last = Math.min(document.numPages, centerPage + RENDER_MARGIN);

        for (const pageNumber of [...this.renderedPages]) {
            if (pageNumber < first || pageNumber > last) {
                this.prunePage(pageNumber);
            }
        }

        for (let pageNumber = first; pageNumber <= last; pageNumber++) {
            if (this.renderedPages.has(pageNumber)) {
                continue;
            }
            if (epoch !== this.renderEpoch) {
                return; // Um zoom ocorreu durante a janela: a próxima janela re-renderiza.
            }

            try {
                await this.renderPageContent(pageNumber, first, last, epoch);

                if (epoch !== this.renderEpoch) {
                    this.prunePage(pageNumber);
                    return;
                }
                this.renderedPages.add(pageNumber);
            } catch (error) {
                if (!this.isRenderCancellation(error)) {
                    console.warn(`[reader] Falha ao renderizar a página ${pageNumber}.`, error);
                }
            }
        }
    }

    private async renderPageContent(pageNumber: number, first: number, last: number, epoch: number): Promise<void> {
        const document = this.pdfDocument;
        if (!document) {
            return;
        }

        const page = await document.getPage(pageNumber);
        const viewport = this.baseViewports[pageNumber - 1]?.clone({ scale: this.scale });

        if (!viewport) {
            return;
        }

        const canvas = await this.pageRenderer.renderPage(pageNumber, page, viewport);

        // A página saiu da janela (ou o zoom mudou) durante a renderização: descarta o resultado.
        if (epoch !== this.renderEpoch || pageNumber < first || pageNumber > last) {
            this.prunePage(pageNumber);
            return;
        }

        this.container.setPageCanvas(pageNumber, canvas);

        const textLayer = this.container.getTextLayer(pageNumber);
        if (textLayer) {
            await this.textLayerRenderer.render(pageNumber, page, viewport, textLayer);
        }
    }

    /** Remove canvas, TextLayer e recursos da página, mantendo o shell para reuso. */
    private prunePage(pageNumber: number, cleanup = true): void {
        this.pageRenderer.cancel(pageNumber);
        this.textLayerRenderer.cancel(pageNumber);
        this.container.removePageContent(pageNumber);
        this.renderedPages.delete(pageNumber);

        if (cleanup && this.pdfDocument) {
            void this.pdfDocument.getPage(pageNumber).then((page) => {
                page.cleanup();
            });
        }
    }

    private async changeZoom(nextScale: number): Promise<void> {
        const document = this.pdfDocument;
        if (!document) {
            return;
        }

        const clampedScale = Math.min(Math.max(nextScale, MIN_SCALE), MAX_SCALE);

        if (clampedScale === this.scale) {
            return;
        }

        this.scale = clampedScale;
        this.toolbar.setZoom(this.scale);
        this.renderEpoch += 1;

        this.container.setScale(this.scale);

        // Redimensiona todos os shells — apenas matemática de viewport, sem re-render.
        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
            const viewport = this.baseViewports[pageNumber - 1]?.clone({ scale: this.scale });
            if (viewport) {
                this.container.resizePageShell(pageNumber, viewport);
            }
        }

        // Descarta o conteúdo na escala antiga (sem cleanup: as mesmas páginas serão re-renderizadas).
        for (const pageNumber of [...this.renderedPages]) {
            this.prunePage(pageNumber, false);
        }

        await this.renderPageWindow(this.pageNumber);
        this.scrollToPage(this.pageNumber);
    }

    private goToPage(pageNumber: number): void {
        if (!this.pdfDocument) {
            return;
        }

        const clampedPage = Math.min(Math.max(pageNumber, 1), this.pdfDocument.numPages);

        this.pageNumber = clampedPage;
        this.toolbar.setPageInfo(clampedPage, this.pdfDocument.numPages);
        this.scrollToPage(clampedPage);
        void this.renderPageWindow(clampedPage);
    }

    private updateVisiblePage(): void {
        if (!this.pdfDocument) {
            return;
        }

        const visiblePage = this.container.getVisiblePageNumber();

        if (visiblePage > 0 && visiblePage !== this.pageNumber) {
            this.pageNumber = visiblePage;
            this.toolbar.setPageInfo(visiblePage, this.pdfDocument.numPages);
            void this.renderPageWindow(visiblePage);
        }
    }

    private scrollToPage(pageNumber: number): void {
        this.container.getPageShell(pageNumber)?.element.scrollIntoView({ block: "start" });
    }

    /** Cancelamentos são fluxo normal (zoom/scroll rápidos); demais erros são reportados. */
    private isRenderCancellation(error: unknown): boolean {
        const name = error instanceof Error ? error.name : "";
        return name === "RenderingCancelledException" || name === "AbortException";
    }

    private async requestTranslation(selectedText: string): Promise<void> {
        const message: TranslateTextMessage = {
            type: MessageType.TRANSLATE_TEXT,
            selectedText,
            sourceLanguage: Language.ENGLISH,
            targetLanguage: Language.PORTUGUESE,
        };

        this.popup.showLoading();

        try {
            const response = await browser.runtime.sendMessage(message) as LearningInteractionResponse;

            if (response.errorMessage) {
                this.popup.showError(response.errorMessage);
                return;
            }

            this.popup.showTranslationPopup({
                ...response,
                originalText: response.originalText ?? selectedText,
            });
        } catch (error) {
            this.popup.showError(error instanceof Error ? error.message : "Falha ao traduzir o texto selecionado.");
        }
    }

    private formatError(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }
}
