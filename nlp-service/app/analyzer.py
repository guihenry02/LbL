"""Execução da análise linguística com spaCy (dependência de infraestrutura).

O modelo é carregado uma única vez, na construção do TextAnalyzer, que
acontece na inicialização do serviço. A classe é stateless: recebe texto
e devolve dados linguísticos estruturados, sem persistência e sem
qualquer interpretação semântica (conceitos, interações, dificuldade).
"""

import spacy

from .models import AnalyzeResponse, LinguisticToken


class TextAnalyzer:
    """Analisa texto e produz dados linguísticos estruturados."""

    def __init__(self, model_name: str = "en_core_web_sm") -> None:
        self._nlp = spacy.load(model_name)

    def analyze(self, text: str) -> AnalyzeResponse:
        doc = self._nlp(text)

        sentences = [sentence.text.strip() for sentence in doc.sents]
        tokens = [
            LinguisticToken(
                text=token.text,
                lemma=token.lemma_,
                pos=token.pos_,
                tag=token.tag_,
                dependency=token.dep_,
            )
            for token in doc
        ]

        return AnalyzeResponse(sentences=sentences, tokens=tokens)
