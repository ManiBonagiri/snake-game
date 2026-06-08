import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const getInitialState = () => ({
  snake: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ],
  food: { x: 15, y: 10 },
  direction: DIRECTIONS.RIGHT,
  nextDirection: DIRECTIONS.RIGHT,
  score: 0,
  level: 1,
  gameOver: false,
  running: false,
  highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
});

const randomFood = (snake) => {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
};

export const useSnakeGame = () => {
  const [state, setState] = useState(getInitialState());
  const stateRef = useRef(state);
  stateRef.current = state;

  const moveSnake = useCallback(() => {
    setState((prev) => {
      if (!prev.running || prev.gameOver) return prev;

      const dir = prev.nextDirection;
      const head = {
        x: (prev.snake[0].x + dir.x + GRID_SIZE) % GRID_SIZE,
        y: (prev.snake[0].y + dir.y + GRID_SIZE) % GRID_SIZE,
      };

      // Self collision
      if (prev.snake.some((s) => s.x === head.x && s.y === head.y)) {
        const newHigh = Math.max(prev.score, prev.highScore);
        localStorage.setItem('snakeHighScore', newHigh);
        return { ...prev, gameOver: true, running: false, highScore: newHigh };
      }

      const ateFood = head.x === prev.food.x && head.y === prev.food.y;
      const newSnake = ateFood ? [head, ...prev.snake] : [head, ...prev.snake.slice(0, -1)];
      const newScore = ateFood ? prev.score + 10 : prev.score;
      const newLevel = Math.floor(newScore / 50) + 1;
      const newFood = ateFood ? randomFood(newSnake) : prev.food;

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        level: newLevel,
        direction: dir,
      };
    });
  }, []);

  const speed = Math.max(60, INITIAL_SPEED - (state.level - 1) * SPEED_INCREMENT);

  useEffect(() => {
    if (!state.running || state.gameOver) return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [state.running, state.gameOver, speed, moveSnake]);

  useEffect(() => {
    const handleKey = (e) => {
      const keyMap = {
        ArrowUp: DIRECTIONS.UP,
        ArrowDown: DIRECTIONS.DOWN,
        ArrowLeft: DIRECTIONS.LEFT,
        ArrowRight: DIRECTIONS.RIGHT,
        w: DIRECTIONS.UP,
        s: DIRECTIONS.DOWN,
        a: DIRECTIONS.LEFT,
        d: DIRECTIONS.RIGHT,
      };
      const newDir = keyMap[e.key];
      if (!newDir) return;
      e.preventDefault();

      setState((prev) => {
        const opposite = {
          x: -prev.direction.x,
          y: -prev.direction.y,
        };
        if (newDir.x === opposite.x && newDir.y === opposite.y) return prev;
        return { ...prev, nextDirection: newDir };
      });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const startGame = useCallback(() => {
    setState({ ...getInitialState(), running: true, highScore: parseInt(localStorage.getItem('snakeHighScore') || '0') });
  }, []);

  const pauseGame = useCallback(() => {
    setState((prev) => ({ ...prev, running: !prev.running }));
  }, []);

  const setDirection = useCallback((dir) => {
    setState((prev) => {
      const opposite = { x: -prev.direction.x, y: -prev.direction.y };
      if (dir.x === opposite.x && dir.y === opposite.y) return prev;
      return { ...prev, nextDirection: dir };
    });
  }, []);

  return {
    ...state,
    GRID_SIZE,
    DIRECTIONS,
    startGame,
    pauseGame,
    setDirection,
  };
};
