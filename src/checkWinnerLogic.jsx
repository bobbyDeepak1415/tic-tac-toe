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