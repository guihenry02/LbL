import * as pdfjs from "pdfjs-dist";
import type { PDFPageProxy, PageViewport, RenderTask } from "pdfjs-dist";

/**
 * Responsável por renderizar as páginas de um documento PDF em elementos
 * <canvas>.
 *
 * Fluxo: PDFDocumentProxy -> PDFPageProxy -> Canvas
 *
 * Nenhuma lógica relacionada à seleção de texto existe neste arquivo.
 */
export class PdfRenderer {

    /** Tasks de renderização em andamento, por número de página. */
    private readonly renderTasks = new Map<number, RenderTask>();

    /**
     * Renderiza uma página em um novo canvas. O canvas é dimensionado pela
     * resolução do dispositivo (via OutputScale) para evitar borrão em telas
     * de alta densidade, mantendo o tamanho lógico do viewport.
     *
     * Uma renderização já em andamento para a mesma página é cancelada antes
     * de iniciar a nova (evita renders obsoletos se sobreporem).
     */
    async renderPage(pageNumber: number, page: PDFPageProxy, viewport: PageViewport): Promise<HTMLCanvasElement> {
        this.renderTasks.get(pageNumber)?.cancel();

        const outputScale = new pdfjs.OutputScale();

        const canvas = document.createElement("canvas");
        canvas.className = "pdf-page__canvas";
        canvas.width = Math.floor(viewport.width * outputScale.sx);
        canvas.height = Math.floor(viewport.height * outputScale.sy);

        const task = page.render({
            canvas,
            viewport,
            ...(outputScale.scaled ? { transform: [outputScale.sx, 0, 0, outputScale.sy, 0, 0] } : {}),
        });
        this.renderTasks.set(pageNumber, task);

        try {
            await task.promise;
            return canvas;
        } finally {
            if (this.renderTasks.get(pageNumber) === task) {
                this.renderTasks.delete(pageNumber);
            }
        }
    }

    /** Cancela a renderização em andamento da página (se houver). */
    cancel(pageNumber: number): void {
        this.renderTasks.get(pageNumber)?.cancel();
        this.renderTasks.delete(pageNumber);
    }

    /** Cancela todas as renderizações em andamento. */
    cancelAll(): void {
        for (const task of this.renderTasks.values()) {
            task.cancel();
        }
        this.renderTasks.clear();
    }
}
