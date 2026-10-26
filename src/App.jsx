
import React, { useState } from 'react';
import { checkWinnerLogic, checkDraw, getComputerMove } from './gameLogic';

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState('InProgress');

  const handleCellClick = (index) => {
    if (board[index] !== null || gameStatus !== 'InProgress') return;

    const currentPlayer = isXNext ? 'X' : 'O';
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winResult = checkWinnerLogic(newBoard);
    if (winResult.winner) {
      setGameStatus('Won');
    } else if (checkDraw(newBoard)) {
      setGameStatus('Draw');
    } else {
      setIsXNext(!isXNext);
    }
  };

  // Reset current game state back to initial values
  const handleResetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('InProgress');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Tic Tac Toe</h1>
      {gameStatus === 'InProgress' && <p>Current Turn: {isXNext ? 'X' : 'O'}</p>}
      {gameStatus === 'Won' && <p style={{ color: 'green' }}>Winner: {isXNext ? 'X' : 'O'}!</p>}
      {gameStatus === 'Draw' && <p style={{ color: 'orange' }}>Game is a Draw!</p>}

      {/* The 3x3 Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 80px)', 
        gridTemplateRows: 'repeat(3, 80px)', 
        gap: '5px',
        marginBottom: '15px'
      }}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            style={{ fontSize: '32px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Reset Button */}
      <button onClick={handleResetGame} style={{ padding: '8px 12px', fontSize: '14px' }}>
        Reset Game
      </button>
    </div>
  );
}