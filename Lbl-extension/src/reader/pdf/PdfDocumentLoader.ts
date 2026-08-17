import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

/**
 * Responsável exclusivamente por carregar um arquivo PDF selecionado pelo
 * usuário e convertê-lo em um objeto PDFDocumentProxy do PDF.js.
 *
 * Fluxo: File -> ArrayBuffer -> PDF.js -> PDFDocumentProxy
 *
 * Nenhuma lógica de renderização existe nesta camada.
 */
export class PdfDocumentLoader {

    async load(file: File): Promise<PDFDocumentProxy> {
        const data = await file.arrayBuffer();
        return pdfjs.getDocument({ data }).promise;
    }
}
