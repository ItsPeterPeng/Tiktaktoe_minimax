var gameBoard;
const user = 'O';
const computer = 'X';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {

  document.querySelector(".endgame").style.display = "none"
  gameBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click',turnClick, false);
  }
}

function turnClick(square) {
  if (typeof gameBoard[square.target.id] == 'number') {
    turn(square.target.id, user);
    if (!checkTie())
    turn(bestSpot(), computer);
  }


}

function turn(squareId, player) {
  gameBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let won = checkWin(gameBoard, player);

  if (won) gameOver(won);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) =>
  (e === player) ? a.concat(i) : a, [])
  let won = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      won = {index: index, player: player};
      break;
    }
  }

  return won;

}

function gameOver(won) {
  for (let index of winCombos[won.index]) {
    document.getElementById(index).style.backgroundColor =
    won.player == user ? "green" : "red";
  }

  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(won.player == user ? "You win!" : "You lose.");
}


function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return gameBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
  return minimax(gameBoard, computer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "yellow";
      cells[i].removeEventListener('click',turnClick, false);
    }
    declareWinner("It's a Tie");

    return ture;

  }

  return false;

}


function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, user)) {
    return {score: -10};
  } else if (checkWin(newBoard, computer)) {
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == computer) {
      if (checkWin(newBoard, computer)) {
        move.score = 10;
        newBoard[availSpots[i]] = move.index;
        return move;
      }
      var result = minimax(newBoard, user);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, computer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if(player === computer) {
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
