import pytest
from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

def teardown_function():
    if os.path.exists("scores.json"):
        os.remove("scores.json")

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["message"] == "Snake Game API is running!"

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_submit_score():
    res = client.post("/score", json={"player_name": "TestUser", "score": 100, "level": 2})
    assert res.status_code == 200
    data = res.json()
    assert data["player_name"] == "TestUser"
    assert data["score"] == 100

def test_leaderboard():
    client.post("/score", json={"player_name": "Alice", "score": 200, "level": 3})
    client.post("/score", json={"player_name": "Bob", "score": 50, "level": 1})
    res = client.get("/leaderboard")
    assert res.status_code == 200
    data = res.json()
    assert data[0]["score"] >= data[1]["score"]

def test_clear_scores():
    client.post("/score", json={"player_name": "Alice", "score": 200, "level": 3})
    res = client.delete("/scores")
    assert res.status_code == 200
    res2 = client.get("/leaderboard")
    assert res2.json() == []
