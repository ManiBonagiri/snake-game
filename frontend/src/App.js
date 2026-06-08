import React, { useState } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import Controls from './components/Controls';
import { submitScore } from './utils/api';
import './App.css';

function App() {
  const game = useSnakeGame();
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lbKey, setLbKey] = useState(0);

  const handleSubmitScore = async () => {
    if (!playerName.trim()) return;
    await submitScore(playerName.trim(), game.score, game.level);
    setSubmitted(true);
    setLbKey((k) => k + 1);
  };

  const handleRestart = () => {
    setSubmitted(false);
    setPlayerName('');
    game.startGame();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🐍 Snake Game</h1>
        <div className="stats">
          <span className="stat">Score: <strong>{game.score}</strong></span>
          <span className="stat">Level: <strong>{game.level}</strong></span>
          <span className="stat">Best: <strong>{game.highScore}</strong></span>
        </div>
      </header>

      <main className="app-main">
        <div className="game-side">
          <div className="board-container">
            <GameBoard
              snake={game.snake}
              food={game.food}
              gridSize={game.GRID_SIZE}
              gameOver={game.gameOver}
              running={game.running}
            />

            {/* Overlays */}
            {!game.running && !game.gameOver && (
              <div className="overlay">
                <div className="overlay-box">
                  <h2>🐍 Snake</h2>
                  <p>Use arrow keys or WASD to move</p>
                  <button className="btn primary" onClick={game.startGame}>Start Game</button>
                </div>
              </div>
            )}

            {game.gameOver && (
              <div className="overlay">
                <div className="overlay-box">
                  <h2>Game Over!</h2>
                  <p className="final-score">Score: <strong>{game.score}</strong> | Level: <strong>{game.level}</strong></p>
                  {!submitted ? (
                    <div className="score-form">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitScore()}
                        maxLength={20}
                      />
                      <button className="btn success" onClick={handleSubmitScore} disabled={!playerName.trim()}>
                        Submit Score
                      </button>
                    </div>
                  ) : (
                    <p className="submitted-msg">✅ Score saved!</p>
                  )}
                  <button className="btn primary" onClick={handleRestart}>Play Again</button>
                </div>
              </div>
            )}

            {game.running && (
              <button className="pause-btn" onClick={game.pauseGame}>⏸ Pause</button>
            )}
          </div>

          <Controls onDirection={game.setDirection} DIRECTIONS={game.DIRECTIONS} />

          <div className="keyboard-hint">
            <span>⌨️ Arrow keys / WASD to move</span>
          </div>
        </div>

        <aside className="side-panel">
          <Leaderboard refreshKey={lbKey} />
        </aside>
      </main>
    </div>
  );
}

export default App;
