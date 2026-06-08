# 🐍 Snake Game — Full Stack (Python + React)

A full-stack Snake game with a Python FastAPI backend (leaderboard/scores) and React frontend.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, CSS3, SVG Canvas          |
| Backend   | Python 3.11, FastAPI, Uvicorn       |
| Container | Docker, Docker Compose              |
| CI/CD     | GitHub Actions                      |
| Cloud     | AWS EC2 + ECR (ap-south-1)          |

---

## 📁 Project Structure

```
snake-game/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── test_main.py         # Pytest tests
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── hooks/useSnakeGame.js
│   │   ├── components/
│   │   │   ├── GameBoard.js
│   │   │   ├── Leaderboard.js
│   │   │   └── Controls.js
│   │   └── utils/api.js
│   ├── public/index.html
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/ci-cd.yml
├── docker-compose.yml
└── README.md
```

---

## 🚀 Local Setup

### Option A: Docker Compose (Recommended)
```bash
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option B: Manual
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm start
```

---

## 🧪 Running Tests

```bash
# Backend
cd backend && pytest test_main.py -v

# Frontend
cd frontend && npm test
```

---

## 🌿 Git Branching Strategy

```
main        ← Production (protected)
develop     ← Integration branch
feature/*   ← Feature branches
```

### Step-by-step workflow:
```bash
# 1. Clone and setup
git clone https://github.com/<your-username>/snake-game.git
cd snake-game

# 2. Create develop branch
git checkout -b develop
git push origin develop

# 3. Create a feature branch
git checkout -b feature/add-levels
# ... make changes ...
git add .
git commit -m "feat: add difficulty levels"
git push origin feature/add-levels

# 4. Open Pull Request: feature/add-levels → develop
# 5. Review and merge PR into develop
# 6. Open Pull Request: develop → main
# 7. Merge → triggers CI/CD pipeline
```

---

## ⚙️ GitHub Actions CI/CD

**Pipeline jobs (on push to main / PR to main):**

| Job              | Trigger         | What it does                        |
|------------------|-----------------|-------------------------------------|
| test-backend     | push/PR         | pytest on FastAPI                   |
| test-frontend    | push/PR         | React tests + build                 |
| build-and-push   | push to main    | Docker build → push to AWS ECR      |
| deploy           | push to main    | SSH into EC2 → docker compose pull  |

---

## ☁️ AWS Deployment Guide

### 1. Create ECR Repositories
```bash
aws ecr create-repository --repository-name snake-game-backend --region ap-south-1
aws ecr create-repository --repository-name snake-game-frontend --region ap-south-1
```

### 2. Launch EC2 Instance
- AMI: Ubuntu 22.04 LTS
- Type: t3.micro (free tier)
- Region: ap-south-1 (Mumbai)
- Security Group: open ports 22, 80, 8000

### 3. Setup EC2
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# Install Docker
sudo apt update && sudo apt install -y docker.io docker-compose-plugin awscli
sudo usermod -aG docker ubuntu

# Clone project
git clone https://github.com/<your-username>/snake-game.git
cd snake-game
```

### 4. GitHub Secrets (Settings → Secrets → Actions)
| Secret Name          | Value                              |
|----------------------|------------------------------------|
| AWS_ACCESS_KEY_ID    | Your IAM user access key           |
| AWS_SECRET_ACCESS_KEY| Your IAM user secret key           |
| EC2_HOST             | EC2 public IP or DNS               |
| EC2_SSH_KEY          | Contents of your .pem file         |
| ECR_REGISTRY         | <account-id>.dkr.ecr.ap-south-1.amazonaws.com |
| REACT_APP_API_URL    | http://<EC2_PUBLIC_IP>:8000        |

### 5. Push to main → auto deploys! 🎉

---

## 🎮 Game Controls

| Key          | Action       |
|--------------|--------------|
| Arrow Up / W | Move Up      |
| Arrow Down / S | Move Down  |
| Arrow Left / A | Move Left  |
| Arrow Right / D | Move Right|
| On-screen D-pad | Mobile controls |

---

## 📡 API Endpoints

| Method | Endpoint     | Description             |
|--------|--------------|-------------------------|
| GET    | /            | Health check            |
| GET    | /health      | Detailed health         |
| POST   | /score       | Submit a score          |
| GET    | /leaderboard | Get top 10 scores       |
| DELETE | /scores      | Clear all scores        |
