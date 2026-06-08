from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime

app = FastAPI(title="Snake Game API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCORES_FILE = "scores.json"

def load_scores():
    if os.path.exists(SCORES_FILE):
        with open(SCORES_FILE, "r") as f:
            return json.load(f)
    return []

def save_scores(scores):
    with open(SCORES_FILE, "w") as f:
        json.dump(scores, f)

class ScoreEntry(BaseModel):
    player_name: str
    score: int
    level: int

class ScoreResponse(BaseModel):
    id: int
    player_name: str
    score: int
    level: int
    date: str

@app.get("/")
def root():
    return {"message": "Snake Game API is running!", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/leaderboard", response_model=List[ScoreResponse])
def get_leaderboard(limit: int = 10):
    scores = load_scores()
    sorted_scores = sorted(scores, key=lambda x: x["score"], reverse=True)
    return sorted_scores[:limit]

@app.post("/score", response_model=ScoreResponse)
def submit_score(entry: ScoreEntry):
    scores = load_scores()
    new_score = {
        "id": len(scores) + 1,
        "player_name": entry.player_name,
        "score": entry.score,
        "level": entry.level,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    scores.append(new_score)
    save_scores(scores)
    return new_score

@app.delete("/scores")
def clear_scores():
    save_scores([])
    return {"message": "All scores cleared"}
