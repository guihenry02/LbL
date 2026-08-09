"""Camada HTTP do servidor NLP (FastAPI).

Responsabilidades: receber o texto, validá-lo via DTO (Pydantic) e
delegar a análise ao TextAnalyzer. Nenhuma regra de negócio vive aqui —
o servidor apenas transforma texto em dados linguísticos estruturados.
"""

from fastapi import FastAPI

from .analyzer import TextAnalyzer
from .models import AnalyzeRequest, AnalyzeResponse

app = FastAPI(
    title="Language Learning — NLP Service",
    description=(
        "Serviço de análise linguística (spaCy) do projeto Language Learning. "
        "Transforma texto em dados linguísticos estruturados consumidos "
        "pelos Analyzers do backend Java."
    ),
    version="1.0.0",
)

# O modelo spaCy é carregado uma única vez, na inicialização do processo.
analyzer = TextAnalyzer()


@app.get("/health")
def health() -> dict[str, str]:
    """Endpoint de readiness (usado pelo healthcheck do Docker)."""
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    """Analisa linguisticamente o texto recebido."""
    return analyzer.analyze(request.text)
