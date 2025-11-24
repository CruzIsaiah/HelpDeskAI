# backend/tests/test_api.py

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "HelpDesk API" in response.json()["message"]


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_troubleshoot_endpoint():
    payload = {
        "transcript": "My laptop keeps disconnecting from WiFi."
    }
    response = client.post("/api/troubleshoot/", json=payload)

    # Endpoint should return 200 even if Pinecone has no docs yet
    assert response.status_code == 200

    data = response.json()

    assert "entities" in data
    assert "steps" in data
    assert "manual_markdown" in data
