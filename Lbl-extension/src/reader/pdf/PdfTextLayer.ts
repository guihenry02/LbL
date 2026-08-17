import * as pdfjs from "pdfjs-dist";
import type { PDFPageProxy, PageViewport } from "pdfjs-dist";

/**
 * Responsável pela criação da camada de texto sobre o canvas de uma página.
 * A renderização do PDF acontece em um bitmap; sem essa camada textual não é
 * possível selecionar palavras.
 *
 * Fluxo: PDFPageProxy -> Extração do texto -> Text Layer -> Seleção do usuário
 */
export class PdfTextLayer {

    /** Camadas de texto em andamento, por número de página. */
    private readonly layers = new Map<number, pdfjs.TextLayer>();

    /**
     * Tokens por página: invalida renderizações concorrentes para a mesma
     * página (a extração do texto é assíncrona e pode resolver fora de ordem).
     */
    private readonly tokens = new Map<number, number>();

    /**
     * Extrai o conteúdo textual da página e renderiza a Text Layer do PDF.js
     * dentro do container fornecido (que deve estar sobreposto ao canvas).
     *
     * O container é esvaziado antes de renderizar — uma Text Layer antiga
     * (de um zoom anterior, por exemplo) é sempre removida.
     */
    async render(pageNumber: number, page: PDFPageProxy, viewport: PageViewport, container: HTMLElement): Promise<void> {
        const token = (this.tokens.get(pageNumber) ?? 0) + 1;
        this.tokens.set(pageNumber, token);

        this.layers.get(pageNumber)?.cancel();

        const textContent = await page.getTextContent();

        if (this.tokens.get(pageNumber) !== token) {
            // A renderização foi cancelada/substituída enquanto o texto era
            // extraído. Rejeita como AbortException para que o chamador não
            // marque a página como renderizada.
            throw Object.assign(new Error("TextLayer task cancelled."), { name: "AbortException" });
        }

        container.replaceChildren();

        const textLayer = new pdfjs.TextLayer({
            textContentSource: textContent,
            container,
            viewport,
        });
        this.layers.set(pageNumber, textLayer);

        try {
            await textLayer.render();
        } finally {
            if (this.tokens.get(pageNumber) === token) {
                this.layers.delete(pageNumber);
                this.tokens.delete(pageNumber);
            }
        }
    }

    /** Cancela a renderização em andamento da página (se houver). */
    cancel(pageNumber: number): void {
        this.tokens.set(pageNumber, (this.tokens.get(pageNumber) ?? 0) + 1);
        this.layers.get(pageNumber)?.cancel();
        this.layers.delete(pageNumber);
    }

    /** Cancela todas as renderizações em andamento. */
    cancelAll(): void {
        for (const layer of this.layers.values()) {
            layer.cancel();
        }
        this.layers.clear();
        this.tokens.clear();
    }
}
