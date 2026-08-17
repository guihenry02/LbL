import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PdfReaderPage } from "./pages/PdfReaderPage";
import "./reader.css";

// Configura o worker do PDF.js para que o parsing do documento não bloqueie a UI.
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const root = document.getElementById("root");

if (!root) {
    throw new Error("Elemento #root não encontrado para inicializar o Reader.");
}

new PdfReaderPage(root);
