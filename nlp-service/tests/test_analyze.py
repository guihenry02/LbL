"""Testes básicos do POST /analyze.

Cobertura:
1. texto simples;
2. múltiplas sentenças;
3. texto vazio/inválido.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_texto_simples():
    response = client.post("/analyze", json={"text": "I gave up smoking."})

    assert response.status_code == 200
    payload = response.json()

    assert payload["sentences"] == ["I gave up smoking."]

    tokens = {token["text"]: token for token in payload["tokens"]}
    assert set(tokens) == {"I", "gave", "up", "smoking", "."}

    # Todo token deve expor os campos do contrato (LinguisticToken.java).
    for token in payload["tokens"]:
        assert set(token) == {"text", "lemma", "pos", "tag", "dependency"}

    assert tokens["I"]["pos"] == "PRON"
    assert tokens["I"]["tag"] == "PRP"
    assert tokens["I"]["dependency"] == "nsubj"
    assert tokens["gave"]["lemma"] == "give"
    assert tokens["up"]["dependency"] == "prt"  # partícula do phrasal verb


def test_multiplas_sentencas():
    response = client.post(
        "/analyze",
        json={"text": "I gave up smoking. She gave him a book."},
    )

    assert response.status_code == 200
    payload = response.json()

    assert payload["sentences"] == [
        "I gave up smoking.",
        "She gave him a book.",
    ]

    texts = [token["text"] for token in payload["tokens"]]
    assert "smoking" in texts
    assert "She" in texts
    assert "book" in texts


def test_texto_vazio_retorna_422():
    response = client.post("/analyze", json={"text": ""})
    assert response.status_code == 422


def test_texto_apenas_espacos_retorna_422():
    response = client.post("/analyze", json={"text": "   \n\t  "})
    assert response.status_code == 422


def test_texto_ausente_retorna_422():
    response = client.post("/analyze", json={})
    assert response.status_code == 422


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
