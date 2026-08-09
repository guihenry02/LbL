"""DTOs (Pydantic) do contrato HTTP do servidor NLP.

Espelham o contrato consumido pelo backend Java:

    LinguisticAnalysis(tokens, sentences)   <- AnalyzeResponse
    LinguisticToken(text, lemma, pos, tag, dependency)  <- LinguisticToken

Nenhuma regra de negócio (conceitos, tipo de interação, dificuldade)
pertence a estes modelos: o servidor apenas transforma texto em dados
linguísticos estruturados.
"""

from pydantic import BaseModel, Field, field_validator


class AnalyzeRequest(BaseModel):
    """Corpo da requisição POST /analyze."""

    text: str = Field(..., description="Texto a ser analisado linguisticamente")

    @field_validator("text")
    @classmethod
    def text_nao_vazio(cls, value: str) -> str:
        """Rejeita texto nulo, vazio ou composto apenas por espaços."""
        value = value.strip()
        if not value:
            raise ValueError("text não pode ser vazio ou conter apenas espaços")
        return value


class LinguisticToken(BaseModel):
    """Um token linguístico (espelha LinguisticToken.java)."""

    text: str
    lemma: str
    pos: str
    tag: str
    dependency: str


class AnalyzeResponse(BaseModel):
    """Resposta do POST /analyze (espelha LinguisticAnalysis.java)."""

    sentences: list[str]
    tokens: list[LinguisticToken]
