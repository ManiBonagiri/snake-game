import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../utils/api';

const Leaderboard = ({ refreshKey }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLeaderboard().then((data) => {
      setScores(data);
      setLoading(false);
    });
  }, [refreshKey]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="leaderboard">
      <h3>🏆 Leaderboard</h3>
      {loading ? (
        <p className="lb-empty">Loading...</p>
      ) : scores.length === 0 ? (
        <p className="lb-empty">No scores yet. Be the first!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
              <th>Lvl</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s.id} className={i < 3 ? 'top-entry' : ''}>
                <td>{medals[i] || i + 1}</td>
                <td>{s.player_name}</td>
                <td className="score-cell">{s.score}</td>
                <td>{s.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
