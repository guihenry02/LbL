import type { TextSelection } from "./TextSelection";

/**
 * Converte qualquer seleção produzida dentro do Reader (hoje, a seleção do
 * navegador sobre a Text Layer do PDF.js) em um objeto TextSelection.
 *
 * O restante da aplicação depende apenas de TextSelection e não conhece a
 * origem do texto selecionado.
 */
export class SelectionManager {

    /**
     * Captura a seleção atual e a transforma em TextSelection.
     * Retorna null quando não há seleção válida.
     */
    capture(selection: Selection | null = window.getSelection()): TextSelection | null {
        const text = selection?.toString().trim();

        if (!selection || !text || selection.rangeCount === 0) {
            return null;
        }

        const rect = selection.getRangeAt(0).getBoundingClientRect();

        return { text, rect };
    }
}
