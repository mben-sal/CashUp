import React, { useEffect, useRef, useState } from 'react';

const PingPongGame = ({ player1Name = "Player 1", player2Name = "Player 2", onGameEnd }) => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(true);
  const [score, setScore] = useState({ player1: 0, player2: 0 });

  // Game state
  const gameStateRef = useRef({
    ball: { x: 0, y: 0, dx: 0, dy: 0, radius: 10 },
    player1: { x: 0, y: 0, width: 15, height: 100, speed: 8, upKey: false, downKey: false },
    player2: { x: 0, y: 0, width: 15, height: 100, speed: 8, upKey: false, downKey: false },
    canvasWidth: 600,  // Adjusted width
    canvasHeight: 400,  // Adjusted height
  });

  // Initialize game
  const initGame = () => {
    const state = gameStateRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;

    // Reset positions
    state.ball.x = canvas.width / 2;
    state.ball.y = canvas.height / 2;
    state.ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
    state.ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);

    state.player1.x = 20;
    state.player1.y = canvas.height / 2 - state.player1.height / 2;

    state.player2.x = canvas.width - 20 - state.player2.width;
    state.player2.y = canvas.height / 2 - state.player2.height / 2;
  };

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = gameStateRef.current;

      switch (e.key.toLowerCase()) {
        case 'w':
          state.player1.upKey = true;
          break;
        case 's':
          state.player1.downKey = true;
          break;
        case 'o':
          state.player2.upKey = true;
          break;
        case 'l':
          state.player2.downKey = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      const state = gameStateRef.current;

      switch (e.key.toLowerCase()) {
        case 'w':
          state.player1.upKey = false;
          break;
        case 's':
          state.player1.downKey = false;
          break;
        case 'o':
          state.player2.upKey = false;
          break;
        case 'l':
          state.player2.downKey = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    initGame();

    const gameLoop = setInterval(() => {
      // Check if the game has ended and stop the loop
      if (!gameStarted) {
        clearInterval(gameLoop);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update player positions
      if (state.player1.upKey && state.player1.y > 0) {
        state.player1.y -= state.player1.speed;
      }
      if (state.player1.downKey && state.player1.y < canvas.height - state.player1.height) {
        state.player1.y += state.player1.speed;
      }

      if (state.player2.upKey && state.player2.y > 0) {
        state.player2.y -= state.player2.speed;
      }
      if (state.player2.downKey && state.player2.y < canvas.height - state.player2.height) {
        state.player2.y += state.player2.speed;
      }

      // Update ball position
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Ball collision with top and bottom walls
      if (state.ball.y - state.ball.radius < 0 || state.ball.y + state.ball.radius > canvas.height) {
        state.ball.dy = -state.ball.dy;
      }

      // Ball collision with paddles
      // Player 1 (left paddle)
      if (
        state.ball.x - state.ball.radius < state.player1.x + state.player1.width &&
        state.ball.y > state.player1.y &&
        state.ball.y < state.player1.y + state.player1.height
      ) {
        state.ball.dx = -state.ball.dx * 1.05;
        const hitPosition = (state.ball.y - (state.player1.y + state.player1.height / 2)) / (state.player1.height / 2);
        state.ball.dy = hitPosition * 5;
      }

      // Player 2 (right paddle)
      if (
        state.ball.x + state.ball.radius > state.player2.x &&
        state.ball.y > state.player2.y &&
        state.ball.y < state.player2.y + state.player2.height
      ) {
        state.ball.dx = -state.ball.dx * 1.05;
        const hitPosition = (state.ball.y - (state.player2.y + state.player2.height / 2)) / (state.player2.height / 2);
        state.ball.dy = hitPosition * 5;
      }

      // Ball out of bounds (score)
      if (state.ball.x - state.ball.radius < 0) {
        // Player 2 scores
        setScore(prev => {
          const newScore = { ...prev, player2: prev.player2 + 1 };
          if (newScore.player2 >= 5) {
            onGameEnd?.(2);
            setGameStarted(false);
          }
          return newScore;
        });
        resetBall();
      } else if (state.ball.x + state.ball.radius > canvas.width) {
        // Player 1 scores
        setScore(prev => {
          const newScore = { ...prev, player1: prev.player1 + 1 };
          if (newScore.player1 >= 5) {
            onGameEnd?.(1);
            setGameStarted(false);
          }
          return newScore;
        });
        resetBall();
      }

      // Draw elements
      drawGame(ctx, state, player1Name, player2Name);
    }, 1000 / 60);

    const resetBall = () => {
      const state = gameStateRef.current;
      state.ball.x = canvas.width / 2;
      state.ball.y = canvas.height / 2;
      state.ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
      state.ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
    };

    return () => {
      clearInterval(gameLoop);
    };
  }, [gameStarted, onGameEnd, player1Name, player2Name]);

  const drawGame = (ctx, state, p1Name, p2Name) => {
    // Draw background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);

    // Draw center line
    ctx.strokeStyle = 'white';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(state.canvasWidth / 2, 0);
    ctx.lineTo(state.canvasWidth / 2, state.canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(state.player1.x, state.player1.y, state.player1.width, state.player1.height);
    ctx.fillRect(state.player2.x, state.player2.y, state.player2.width, state.player2.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score.player1, state.canvasWidth / 4, 30);
    ctx.fillText(score.player2, state.canvasWidth * 3 / 4, 30);

    // Draw player names
    ctx.font = '16px Arial';
    ctx.fillText(p1Name, state.canvasWidth / 4, state.canvasHeight - 10);
    ctx.fillText(p2Name, state.canvasWidth * 3 / 4, state.canvasHeight - 10);
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#1c1c1c', padding: '20px' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid white',
          backgroundColor: 'black',
          margin: '0 auto',
        }}
      />
    </div>
  );
};

export default PingPongGame;
