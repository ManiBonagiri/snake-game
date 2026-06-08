import React from 'react';

const CELL = 24;

const GameBoard = ({ snake, food, gridSize, gameOver, running }) => {
  const size = gridSize * CELL;

  const snakeSet = new Set(snake.map((s) => `${s.x},${s.y}`));
  const head = snake[0];

  return (
    <div className="board-wrapper">
      <svg
        width={size}
        height={size}
        style={{ display: 'block', borderRadius: '8px', overflow: 'hidden' }}
      >
        {/* Grid background */}
        {Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => (
            <rect
              key={`${col},${row}`}
              x={col * CELL}
              y={row * CELL}
              width={CELL}
              height={CELL}
              fill={(col + row) % 2 === 0 ? '#0d1117' : '#0f1923'}
            />
          ))
        )}

        {/* Snake body */}
        {snake.slice(1).map((seg, i) => (
          <rect
            key={i}
            x={seg.x * CELL + 1}
            y={seg.y * CELL + 1}
            width={CELL - 2}
            height={CELL - 2}
            rx={4}
            fill={`hsl(${140 + i * 2}, 70%, ${45 - i * 0.5}%)`}
          />
        ))}

        {/* Snake head */}
        {head && (
          <g>
            <rect
              x={head.x * CELL + 1}
              y={head.y * CELL + 1}
              width={CELL - 2}
              height={CELL - 2}
              rx={5}
              fill="#4ade80"
            />
            {/* Eyes */}
            <circle cx={head.x * CELL + 7} cy={head.y * CELL + 7} r={2.5} fill="#0d1117" />
            <circle cx={head.x * CELL + 17} cy={head.y * CELL + 7} r={2.5} fill="#0d1117" />
            <circle cx={head.x * CELL + 8} cy={head.y * CELL + 7} r={1} fill="#fff" />
            <circle cx={head.x * CELL + 18} cy={head.y * CELL + 7} r={1} fill="#fff" />
          </g>
        )}

        {/* Food */}
        <g>
          <circle
            cx={food.x * CELL + CELL / 2}
            cy={food.y * CELL + CELL / 2}
            r={CELL / 2 - 3}
            fill="#f87171"
          />
          <ellipse
            cx={food.x * CELL + CELL / 2 + 1}
            cy={food.y * CELL + 4}
            rx={2}
            ry={4}
            fill="#4ade80"
          />
        </g>

        {/* Overlay */}
        {(gameOver || !running) && (
          <rect x={0} y={0} width={size} height={size} fill="rgba(0,0,0,0.55)" />
        )}
      </svg>
    </div>
  );
};

export default GameBoard;
