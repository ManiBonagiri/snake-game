const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const submitScore = async (playerName, score, level) => {
  try {
    const res = await fetch(`${API_BASE}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: playerName, score, level }),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to submit score:', err);
    return null;
  }
};

export const getLeaderboard = async () => {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
    return [];
  }
};
