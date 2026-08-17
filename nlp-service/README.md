# NLP Service

Serviço Python independente de análise linguística do projeto Language Learning.
Recebe texto e devolve dados linguísticos estruturados (sentenças e tokens com
lemma, POS, tag e dependência), usando **FastAPI + spaCy** (`en_core_web_sm`).

**Escopo**: apenas `texto → dados linguísticos estruturados`. Não classifica
conceitos, tipo de interação, dificuldade, não persiste nada e não chama IA.
Essas responsabilidades pertencem aos `Analyzer`s do backend Java
(`InteractionTypeAnalyzer`, `ConceptAnalyzer`).

## Estrutura

```
nlp-service/
├── app/
│   ├── main.py        # camada HTTP (FastAPI)
│   ├── models.py      # DTOs (Pydantic)
│   └── analyzer.py    # execução da análise spaCy
├── tests/
│   └── test_analyze.py
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
└── README.md
```

## Instalação

```bash
cd nlp-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

O arquivo `requirements.txt` já inclui o modelo `en_core_web_sm` (3.8.0) via
wheel oficial — não é necessário rodar `python -m spacy download` à parte.
Para baixar/atualizar o modelo manualmente:

```bash
python -m spacy download en_core_web_sm
```

## Execução local

```bash
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8090 --reload
```

O modelo spaCy é carregado **uma única vez**, na inicialização do processo.

## Testes

```bash
source .venv/bin/activate
pip install -r requirements-dev.txt
python -m pytest
```

## Execução via Docker

```bash
docker build -t nlp-service .
docker run --rm -p 8090:8090 nlp-service
```

Healthcheck em `/health`; documentação interativa em `http://localhost:8090/docs`.

## Exemplo de request

```bash
curl -X POST http://localhost:8090/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I gave up smoking."}'
```

## Exemplo de response

```json
{
  "sentences": ["I gave up smoking."],
  "tokens": [
    {"text": "I",       "lemma": "I",     "pos": "PRON", "tag": "PRP", "dependency": "nsubj"},
    {"text": "gave",    "lemma": "give",  "pos": "VERB", "tag": "VBD", "dependency": "ROOT"},
    {"text": "up",      "lemma": "up",    "pos": "ADP",  "tag": "RP",  "dependency": "prt"},
    {"text": "smoking", "lemma": "smoking", "pos": "NOUN", "tag": "NN", "dependency": "dobj"},
    {"text": ".",       "lemma": ".",     "pos": "PUNCT","tag": ".",   "dependency": "punct"}
  ]
}
```

## Contrato

| Campo       | Descrição                          |
|-------------|------------------------------------|
| `sentences` | lista de sentenças do texto        |
| `tokens[].text`       | token (superfície)        |
| `tokens[].lemma`      | lema                    |
| `tokens[].pos`        | classe gramatical (Universal Dependencies) |
| `tokens[].tag`        | tag detalhada (treebank do modelo) |
| `tokens[].dependency` | relação de dependência              |

Entrada inválida (`text` ausente, vazio ou só espaços) → `422 Unprocessable Entity`.

O response espelha os records Java `LinguisticAnalysis` e `LinguisticToken`:
o `NLPProvider` do backend pode mapear o JSON diretamente, sem transformações.
