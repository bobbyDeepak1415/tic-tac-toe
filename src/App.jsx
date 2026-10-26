import { useState } from 'react';
import { checkWinnerLogic, checkDraw, getComputerMove } from './gameLogic';

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('twoplayer'); 
  const [gameStatus, setGameStatus] = useState('InProgress');
  const [moveHistory, setMoveHistory] = useState([]);
  const [winningCells, setWinningCells] = useState([]);
  const [scoreboard, setScoreboard] = useState({ X: 0, O: 0, Draws: 0 });

  const handleCellClick = (index) => {
    if (board[index] !== null || gameStatus !== 'InProgress') return;

    const currentPlayer = isXNext ? 'X' : 'O';
    makeMove(index, currentPlayer);

    if (gameMode === 'computer' && currentPlayer === 'X') {
      setTimeout(() => {
        setBoard(currentBoard => {
          const winCheck = checkWinnerLogic(currentBoard);
          if (winCheck.winner || checkDraw(currentBoard)) return currentBoard;

          const compIndex = getComputerMove(currentBoard);
          if (compIndex !== null) {
            const updatedBoard = [...currentBoard];
            updatedBoard[compIndex] = 'O';

            const row = Math.floor(compIndex / 3) + 1;
            const col = (compIndex % 3) + 1;

            setMoveHistory(prevHistory => [
              ...prevHistory,
              { moveNumber: prevHistory.length + 1, player: 'O', position: `Row ${row}, Column ${col}`, index: compIndex }
            ]);

            const compWinResult = checkWinnerLogic(updatedBoard);
            if (compWinResult.winner) {
              setGameStatus('Won');
              setWinningCells(compWinResult.winningCells);
              setScoreboard(prev => ({ ...prev, O: prev.O + 1 }));
            } else if (checkDraw(updatedBoard)) {
              setGameStatus('Draw');
              setScoreboard(prev => ({ ...prev, Draws: prev.Draws + 1 }));
            } else {
              setIsXNext(true); 
            }

            return updatedBoard;
          }
          return currentBoard;
        });
      }, 300); 
    }
  };

  const makeMove = (index, player) => {
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;

    const newMove = {
      moveNumber: moveHistory.length + 1,
      player: player,
      position: `Row ${row}, Column ${col}`,
      index: index
    };
    setMoveHistory(prev => [...prev, newMove]);

    const winResult = checkWinnerLogic(newBoard);
    if (winResult.winner) {
      setGameStatus('Won');
      setWinningCells(winResult.winningCells);
      setScoreboard(prev => ({
        ...prev,
        [winResult.winner]: prev[winResult.winner] + 1
      }));
    } else if (checkDraw(newBoard)) {
      setGameStatus('Draw');
      setScoreboard(prev => ({ ...prev, Draws: prev.Draws + 1 }));
    } else {
      setIsXNext(!isXNext);
    }
  };

  const handleUndo = () => {
    if (moveHistory.length === 0) return;

    let stepsToUndo = 1;
    if (gameMode === 'computer' && moveHistory.length >= 2 && !isXNext) {
      stepsToUndo = 2;
    }

    const newHistory = moveHistory.slice(0, moveHistory.length - stepsToUndo);
    
    const restoredBoard = Array(9).fill(null);
    newHistory.forEach(m => {
      restoredBoard[m.index] = m.player;
    });

    setBoard(restoredBoard);
    setMoveHistory(newHistory);
    setGameStatus('InProgress');
    setWinningCells([]);
    setIsXNext(newHistory.length % 2 === 0);
  };

  const handleResetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('InProgress');
    setMoveHistory([]);
    setWinningCells([]);
  };

  const handleResetScoreboard = () => {
    setScoreboard({ X: 0, O: 0, Draws: 0 });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      <div>
        <h1>Tic Tac Toe</h1>

      
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginRight: '15px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="gameMode" 
              checked={gameMode === 'twoplayer'} 
              onChange={() => { setGameMode('twoplayer'); handleResetGame(); }} 
            /> Two Player
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="gameMode" 
              checked={gameMode === 'computer'} 
              onChange={() => { setGameMode('computer'); handleResetGame(); }} 
            /> vs Computer
          </label>
        </div>

        {gameStatus === 'InProgress' && <p>Current Turn: {isXNext ? 'X' : 'O'}</p>}
        {gameStatus === 'Won' && <p style={{ color: 'green' }}>Winner: Player found!</p>}
        {gameStatus === 'Draw' && <p style={{ color: 'orange' }}>Game is a Draw!</p>}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 80px)', 
          gridTemplateRows: 'repeat(3, 80px)', 
          gap: '5px',
          marginBottom: '15px'
        }}>
          {board.map((cell, index) => {
            const isWinningCell = winningCells.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  backgroundColor: isWinningCell ? '#d4edda' : '#f8f9fa',
                  cursor: cell || gameStatus !== 'InProgress' ? 'not-allowed' : 'pointer'
                }}
              >
                {cell}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleResetGame} style={{ padding: '8px 12px', fontSize: '14px' }}>
            Reset Game
          </button>
          <button 
            onClick={handleUndo} 
            disabled={moveHistory.length === 0} 
            style={{ padding: '8px 12px', fontSize: '14px' }}
          >
            Undo Last Move
          </button>
        </div>
      </div>

      <div>
        <h3>Scoreboard</h3>
        <table border="1" cellPadding="6" style={{ marginBottom: '10px', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>X Wins</th>
              <th>O Wins</th>
              <th>Draws</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{scoreboard.X}</td>
              <td>{scoreboard.O}</td>
              <td>{scoreboard.Draws}</td>
            </tr>
          </tbody>
        </table>
        <button onClick={handleResetScoreboard} style={{ padding: '6px 10px', marginBottom: '20px', fontSize: '12px' }}>
          Reset Scoreboard
        </button>

        <h3>Move History</h3>
        <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', width: '220px' }}>
          {moveHistory.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#666' }}>No moves yet.</p>
          ) : (
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
              {moveHistory.map((m) => (
                <li key={m.moveNumber}>
                  Player {m.player}: {m.position}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}