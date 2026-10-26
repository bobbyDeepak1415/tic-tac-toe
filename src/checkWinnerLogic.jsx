// Winning combinations for a 3x3 board (indices 0 to 8)
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]           
];


function checkWinnerLogic(board){

  for(let combo of WINNING_COMBINATIONS){
    const [a,b,c]=combo

    if(board[a] && board[a]===board[b] && board[a]===board[c]){
      return {winner:board[a],winningCells:combo}
    }

  }

  return {winner:null,winningCells:[]}

}

export function checkDraw(board){
return board.every(cell=>cell!==null) &&!checkWinnerLogic(board).winner
}


export function getComputerMove(board) {
  const emptyIndices = board
    .map((val, idx) => (val === null ? idx : null))
    .filter(val => val !== null);

  if (emptyIndices.length === 0) return null;

  for (let idx of emptyIndices) {
    const tempBoard = [...board];
    tempBoard[idx] = 'O';
    if (checkWinner(tempBoard).winner === 'O') {
      return idx;
    }
  }

  for (let idx of emptyIndices) {
    const tempBoard = [...board];
    tempBoard[idx] = 'X';
    if (checkWinner(tempBoard).winner === 'X') {
      return idx;
    }
  }


  if (board[4] === null) {
    return 4;
  }

  const corners = [0, 2, 6, 8].filter(idx => board[idx] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // Priority 5: Take any remaining available cell
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

