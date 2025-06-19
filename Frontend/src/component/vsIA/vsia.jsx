

import React, { useRef, useEffect, useState } from 'react';

export const model = {
    "key": 2193,
    "connections": [
      {
        "key": [
          -1,
          0
        ],
        "weight": 0.10712592235710172,
        "enabled": false
      },
      {
        "key": [
          -1,
          1
        ],
        "weight": 2.226416270951379,
        "enabled": false
      },
      {
        "key": [
          -2,
          2
        ],
        "weight": 2.1653029335398886,
        "enabled": true
      },
      {
        "key": [
          -3,
          1
        ],
        "weight": 2.385845538406643,
        "enabled": true
      },
      {
        "key": [
          -2,
          0
        ],
        "weight": 0.8033210735790193,
        "enabled": true
      },
      {
        "key": [
          -1,
          288
        ],
        "weight": -0.038220384733030244,
        "enabled": true
      },
      {
        "key": [
          -3,
          2
        ],
        "weight": -2.297624624741982,
        "enabled": false
      },
      {
        "key": [
          -3,
          492
        ],
        "weight": -0.6876355281641421,
        "enabled": true
      },
      {
        "key": [
          -1,
          531
        ],
        "weight": -1.4737939706715888,
        "enabled": true
      },
      {
        "key": [
          594,
          288
        ],
        "weight": 2.2200976288408807,
        "enabled": true
      }
    ],
    "nodes": [
      {
        "key": 0,
        "bias": 3.487597478514236,
        "response": 1.0,
        "activation": "relu",
        "aggregation": "sum"
      },
      {
        "key": 1,
        "bias": 0.2715504777215128,
        "response": 1.0,
        "activation": "relu",
        "aggregation": "sum"
      },
      {
        "key": 2,
        "bias": 4.912182824840164,
        "response": 1.0,
        "activation": "relu",
        "aggregation": "sum"
      },
      {
        "key": 288,
        "bias": 5.43960711196676,
        "response": 1.0,
        "activation": "relu",
        "aggregation": "sum"
      },
      {
        "key": 492,
        "bias": 2.382396106309587,
        "response": 1.0,
        "activation": "relu",
        "aggregation": "sum"
      },
      {
        "key": 531,
        "bias": 2.873180570750076,
        "response": 1.0,
        "activation": "relu",
        "aggregation": "sum"
      },
      {
        "key": 594,
        "bias": 3.6871853741033718,
        "response": 1.0,
        "activation": "relu",
        "aggregation": "sum"
      }
    ],
    "fitness": 494
  }

// Game Constants
const MAX_VEL = 7;
const BALL_RADIUS = 7;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_VEL = 7;

// NEAT Model  

// Activation function
const activateRelu = (x) => Math.max(0, x);

const feedForward = (inputs, model) => {
  const nodeValues = {};
  
  // Set input nodes (NEAT uses -1, -2, -3 for inputs)
  nodeValues[-1] = inputs[0]; // ball.x
  nodeValues[-2] = inputs[1]; // ball.y
  nodeValues[-3] = inputs[2]; // paddle.y

  // Process all nodes in order
  model.nodes.forEach(node => {
      let sum = node.bias;
      
      model.connections
          .filter(conn => conn.enabled && conn.key[1] === node.key)
          .forEach(conn => {
              sum += (nodeValues[conn.key[0]] || 0) * conn.weight;
          });
      
      nodeValues[node.key] = activateRelu(sum * node.response);
  });

  // Output nodes (assuming 0=stay, 1=up, 2=down)
  return [
      nodeValues[0] || 0,
      nodeValues[1] || 0,
      nodeValues[2] || 0
  ];
};

// Ball Component
class Ball {
  constructor(x, y) {
    this.x = this.original_x = x;
    this.y = this.original_y = y;
    
    const angle = this._getRandomAngle(-30, 30, [0]);
    const pos = Math.random() < 0.5 ? 1 : -1;
    
    this.x_vel = pos * Math.abs(Math.cos(angle) * MAX_VEL);
    this.y_vel = Math.sin(angle) * MAX_VEL;
  }
  
  _getRandomAngle(minAngle, maxAngle, excluded) {
    let angle = 0;
    while (excluded.includes(angle)) {
      angle = (Math.random() * (maxAngle - minAngle) + minAngle) * Math.PI / 180;
    }
    return angle;
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }
  
  move() {
    this.x += this.x_vel;
    this.y += this.y_vel;
  }
  
  reset() {
    this.x = this.original_x;
    this.y = this.original_y;
    
    const angle = this._getRandomAngle(-30, 30, [0]);
    const x_vel = Math.abs(Math.cos(angle) * MAX_VEL);
    const y_vel = Math.sin(angle) * MAX_VEL;
    
    this.y_vel = y_vel;
    this.x_vel *= -1;
  }
}

// Paddle Component
class Paddle {
  constructor(x, y) {
    this.x = this.original_x = x;
    this.y = this.original_y = y;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.vel = PADDLE_VEL;
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }
  
  
  move(up = true) {
    if (up) {
      this.y -= this.vel;
    } else {
      this.y += this.vel;
    }
  }
  
  reset() {
    this.x = this.original_x;
    this.y = this.original_y;
  }
}

// Game Component
const PongGame = ({ width = 700, height = 500 }) => {
  const canvasRef = useRef(null);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [leftHits, setLeftHits] = useState(0);
  const [rightHits, setRightHits] = useState(0);
  const [aiActive, setAiActive] = useState(true);
  const [debugInfo, setDebugInfo] = useState({ inputs: [], outputs: [], decision: null });
  
  const [countdown, setCountdown] = useState(null);

  const startCountdown = () => {
    let counter = 3;
    setCountdown(counter);
    
    const timer = setInterval(() => {
      counter--;
      
      if (counter > 0) {
        setCountdown(counter);
      } else if (counter === 0) {
        setCountdown('START');
      } else {
        clearInterval(timer);
        setCountdown(null);
        
        // Réinitialiser le ballon avec une nouvelle vitesse
        const ball = ballRef.current;
        ball.x = ball.original_x;
        ball.y = ball.original_y;
        
        const angle = ball._getRandomAngle(-30, 30, [0]);
        const pos = Math.random() < 0.5 ? 1 : -1;
        ball.x_vel = pos * Math.abs(Math.cos(angle) * MAX_VEL);
        ball.y_vel = Math.sin(angle) * MAX_VEL;
      }
    }, 1000);
  };

  // Game objects
  const ballRef = useRef(null);
  const leftPaddleRef = useRef(null);
  const rightPaddleRef = useRef(null);
  
  // Key states
  const keysRef = useRef({
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
  });
  
  // AI decision making
  const makeAiDecision = () => {
    if (!ballRef.current || !rightPaddleRef.current) return;

    const ball = ballRef.current;
    const rightPaddle = rightPaddleRef.current;
    
    // Prepare inputs
    const inputs = [
      ball.x,
      ball.y,
      rightPaddle.y  
    ];
    
    // Get network outputs
    const outputs = feedForward(inputs, model);
    const decision = outputs.indexOf(Math.max(...outputs));
    
    // Update debug info
    setDebugInfo({ inputs, outputs, decision });
    
    // Apply movement based on decision
    if (decision === 1 && rightPaddle.y > 0) {
      rightPaddle.move(true); // Move up
    } 
    else if (decision === 2 && rightPaddle.y < height - PADDLE_HEIGHT) {
      rightPaddle.move(false); // Move down
    }
    // If decision is 0, do nothing (stay)
  };

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Initialize game objects
    ballRef.current = new Ball(width / 2, height / 2);
    leftPaddleRef.current = new Paddle(10, height / 2 - PADDLE_HEIGHT / 2);
    rightPaddleRef.current = new Paddle(width - 10 - PADDLE_WIDTH, height / 2 - PADDLE_HEIGHT / 2);
    
    // Event listeners
    const handleKeyDown = (e) => {
      if (['w', 's', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        keysRef.current[e.key] = true;
      }
      if (e.key === ' ') {
        setAiActive(prev => !prev);
      }
    };
    
    const handleKeyUp = (e) => {
      if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        keysRef.current[e.key] = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Game loop
    let lastTime = 0;
    const frameRate = 60;
    const frameDelay = 1000 / frameRate;

    const gameLoop = (timestamp) => {
      if (timestamp - lastTime > frameDelay) {
        update();
        draw(ctx);
        lastTime = timestamp;
      }
      requestAnimationFrame(gameLoop);
    };
    
    requestAnimationFrame(gameLoop);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [width, height]);
  
  // Handle collision
  const handleCollision = () => {
    const ball = ballRef.current;
    const leftPaddle = leftPaddleRef.current;
    const rightPaddle = rightPaddleRef.current;
    
    // Wall collision
    if (ball.y + BALL_RADIUS >= height || ball.y - BALL_RADIUS <= 0) {
      ball.y_vel *= -1;
    }
    
    // Paddle collision
    if (ball.x_vel < 0) {
      // Left paddle
      if (ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + PADDLE_HEIGHT && 
          ball.x - BALL_RADIUS <= leftPaddle.x + PADDLE_WIDTH) {
        ball.x_vel *= -1;
        const relativeIntersect = (leftPaddle.y + PADDLE_HEIGHT/2) - ball.y;
        const normalized = relativeIntersect / (PADDLE_HEIGHT/2);
        ball.y_vel = -normalized * MAX_VEL;
        setLeftHits(prev => prev + 1);
      }
    } else {
      // Right paddle
      if (ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + PADDLE_HEIGHT && 
          ball.x + BALL_RADIUS >= rightPaddle.x) {
        ball.x_vel *= -1;
        const relativeIntersect = (rightPaddle.y + PADDLE_HEIGHT/2) - ball.y;
        const normalized = relativeIntersect / (PADDLE_HEIGHT/2);
        ball.y_vel = -normalized * MAX_VEL;
        setRightHits(prev => prev + 1);
      }
    }
  };
  
  // Update game state
  const update = () => {
    const ball = ballRef.current;
    const leftPaddle = leftPaddleRef.current;
    const rightPaddle = rightPaddleRef.current;
    const keys = keysRef.current;

    if (countdown === null) {
      ball.move();
      handleCollision();
    }

    // Move left paddle
    if (keys.w && leftPaddle.y > 0) leftPaddle.move(true);
    if (keys.s && leftPaddle.y < height - PADDLE_HEIGHT) leftPaddle.move(false);
    
    // Move right paddle (AI or player)
    if (aiActive) {
      makeAiDecision();
    } else {
      if (keys.ArrowUp && rightPaddle.y > 0) rightPaddle.move(true);
      if (keys.ArrowDown && rightPaddle.y < height - PADDLE_HEIGHT) rightPaddle.move(false);
    }
    
    // Move ball and handle collisions
    ball.move();
    handleCollision();
    
    // Scoring
    if (ball.x < 0) {
      setRightScore(prev => prev + 1);
      ball.reset();
      rightPaddleRef.current.reset();
      leftPaddleRef.current.reset();
      ball.x_vel = 0;
      ball.y_vel = 0;
      startCountdown();
    } else if (ball.x > width) {
      setLeftScore(prev => prev + 1);
      ball.reset();
      rightPaddleRef.current.reset();
      leftPaddleRef.current.reset();
      ball.x_vel = 0;
      ball.y_vel = 0;
      startCountdown();
    }
  };

  const draw = (ctx) => {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    // Draw divider
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw scores - modified version
    ctx.font = 'bold 50px sans-serif';  // Changed to sans-serif
    ctx.fillStyle = '#FFFFFF';  // Explicit white
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';  // Explicit baseline
    

    // Left score
    // ctx.fillText(leftScore.toString(), width / 4, 20);
    
    // // Right score
    // ctx.fillText(rightScore.toString(), (width * 3) / 4, 20);
    
    // // Hits counter
    // ctx.font = '20px sans-serif';
    // ctx.fillText(`Hits: ${leftHits + rightHits}`, width / 2, height - 30);
    
    // Countdown
    if (countdown !== null) {
      ctx.font = 'bold 100px sans-serif';
      ctx.fillStyle = 'red';
      ctx.fillText(countdown.toString(), width / 2, height / 2 - 50);
    }
    
    // Draw game objects
    leftPaddleRef.current.draw(ctx);
    rightPaddleRef.current.draw(ctx);
    ballRef.current.draw(ctx);
  };
  const getScoreColors = () => {
    if (leftScore > rightScore) {
      return { playerColor: 'green', aiColor: 'red' };
    } else if (rightScore > leftScore) {
      return { playerColor: 'red', aiColor: 'green' };
    }
    return { playerColor: 'white', aiColor: 'white' }; // Tie
  };

  const { playerColor, aiColor } = getScoreColors();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '90vw',
      margin: 0,
      padding: 0,
      backgroundColor: 'black',
      overflow: 'hidden'
    }}>
      {/* External Score Display with dynamic colors */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: `${width}px`,
        maxWidth: '100vw',
        marginBottom: '20px',
        fontFamily: '"Courier New", monospace',
        fontSize: '34px',
        fontWeight: 'bold'
      }}>
        <div style={{ color: playerColor }}>Player: {leftScore}</div>
        <div style={{ color: aiColor }}>AI: {rightScore}</div>
      </div>

      {/* Game Canvas Container */}
      <div style={{
        display: 'flex',
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        // maxWidth: '100vw',
        // maxHeight: '120vh',
        // aspectRatio: `${width}/${height}`
      }}>
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height}
          style={{ 
            display: 'flex',
            width: '100%',
            height: '90%',
            border: '2px solid white',
            borderRadius: '10px',
            imageRendering: 'pixelated'
          }}
          />
      </div>

      {/* Countdown Display */}
      {countdown !== null && (
        <div style={{
          display: 'flex',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'red',
          fontFamily: '"Courier New", monospace',
          fontSize: '100px',
          fontWeight: 'bold',
          zIndex: 10,
          textShadow: '0 0 10px black'
        }}>
          {countdown}
        </div>
      )}
    </div>
  );
};

export default PongGame;
