import type { PageViewport } from "pdfjs-dist";

export interface PageShell {
    element: HTMLElement;
    textLayer: HTMLElement;
}

/**
 * Organiza visualmente o documento e gerencia o espaço onde as páginas serão
 * renderizadas. Cada página recebe um "shell" (contêiner do tamanho exato do
 * viewport) que hospeda o canvas e a camada de texto sobreposta.
 *
 * O conteúdo de cada shell (canvas + spans da TextLayer) pode ser adicionado e
 * removido sob demanda, mantendo o shell para reuso — é isso que permite a
 * renderização virtualizada de documentos grandes.
 */
export class ReaderContainer {

    private readonly element: HTMLElement;
    private readonly pageShells: PageShell[] = [];

    constructor(element: HTMLElement) {
        this.element = element;
    }

    mount(host: HTMLElement): void {
        host.appendChild(this.element);
    }

    get contentWidth(): number {
        return this.element.clientWidth;
    }

    clear(): void {
        this.element.replaceChildren();
        this.element.scrollTop = 0;
        this.pageShells.length = 0;
    }

    onScroll(callback: () => void): void {
        this.element.addEventListener("scroll", callback);
    }

    /** Mantém a variável CSS --scale-factor (usada pelo TextLayer do PDF.js) em sincronia com a escala atual. */
    setScale(scale: number): void {
        this.element.style.setProperty("--scale-factor", String(scale));
    }

    createPageShell(viewport: PageViewport): PageShell {
        const element = document.createElement("div");
        element.className = "pdf-page";
        element.style.width = `${viewport.width}px`;
        element.style.height = `${viewport.height}px`;

        const textLayer = document.createElement("div");
        textLayer.className = "textLayer";
        element.appendChild(textLayer);

        const shell: PageShell = { element, textLayer };
        this.pageShells.push(shell);

        return shell;
    }

    appendPageShell(shell: PageShell, canvas?: HTMLCanvasElement): void {
        if (canvas) {
            shell.element.insertBefore(canvas, shell.textLayer);
        }
        this.element.appendChild(shell.element);
    }

    /** Insere (ou substitui) o canvas da página, sempre abaixo da camada de texto. */
    setPageCanvas(pageNumber: number, canvas: HTMLCanvasElement): void {
        const shell = this.pageShells[pageNumber - 1];
        if (!shell) {
            return;
        }
        shell.element.querySelector(".pdf-page__canvas")?.remove();
        shell.element.insertBefore(canvas, shell.textLayer);
    }

    /** Redimensiona o shell de uma página (zoom) sem reconstruí-lo. */
    resizePageShell(pageNumber: number, viewport: PageViewport): void {
        const shell = this.pageShells[pageNumber - 1];
        if (!shell) {
            return;
        }
        shell.element.style.width = `${viewport.width}px`;
        shell.element.style.height = `${viewport.height}px`;
    }

    /** Remove o canvas e os spans da TextLayer da página, mantendo o shell para reuso. */
    removePageContent(pageNumber: number): void {
        const shell = this.pageShells[pageNumber - 1];
        if (!shell) {
            return;
        }
        shell.element.querySelector(".pdf-page__canvas")?.remove();
        shell.textLayer.replaceChildren();
    }

    getPageShell(pageNumber: number): PageShell | undefined {
        return this.pageShells[pageNumber - 1];
    }

    getTextLayer(pageNumber: number): HTMLElement | undefined {
        return this.getPageShell(pageNumber)?.textLayer;
    }

    /** Número da página mais próxima do centro da área visível do container. */
    getVisiblePageNumber(): number {
        const { scrollTop, clientHeight } = this.element;
        const threshold = scrollTop + clientHeight * 0.5;

        let visible = 0;
        for (let i = 0; i < this.pageShells.length; i++) {
            if (this.pageShells[i].element.offsetTop <= threshold) {
                visible = i + 1;
            } else {
                break;
            }
        }

        return visible;
    }

    showStatus(message: string): void {
        this.clear();

        const status = document.createElement("div");
        status.className = "reader-status";
        status.textContent = message;
        this.element.appendChild(status);
    }
}
