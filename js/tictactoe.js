function ticTacToe() {
  const
    ai = document.querySelector('div.ai'),
    oScoreboard = document.querySelector('div.o-score'),
    xScoreboard = document.querySelector('div.x-score'),
    restart = document.querySelector('div.restart'),
    field = document.querySelector('div.field'),
    cells = field.querySelectorAll('div.col'),
    message = document.querySelector('div.message'),
    winStates = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

  let
    game = [],
    turn = 'o',
    oScore = 0,
    xScore = 0,
    start = 'o',
    end = false;

  cells.forEach(cell => cell.onclick = () => {
    restart.classList.remove('disabled');
    ai.classList.add('disabled');
    if (!(cell.classList.contains('o') || cell.classList.contains('x'))) {
      doMove(cell);
      if (!end && game.filter(cell => cell !== undefined).length < 9) if (ai.classList.contains('active')) aiMove();
    }
  });

  function doMove(cell) {
    cell.classList.add(turn);
    game[cell.id] = turn;
    if (turn === 'o') {
      turn = 'x';
      field.classList.remove('o-turn');
      field.classList.add('x-turn');
      message.innerHTML = 'Cross\'s turn!';
    } else {
      turn = 'o';
      field.classList.remove('x-turn');
      field.classList.add('o-turn');
      message.innerHTML = 'Circles turn!';
    }
    checkWin();
  }

  function aiMove() {
    let move = randomAiMove();
    winStates.forEach(state => {
      if (game[state[0]] === 'x' && game[state[1]] === 'x' && game[state[2]] === undefined) move = state[2];
      else if (game[state[0]] === 'x' && game[state[1]] === undefined && game[state[2]] === 'x') move = state[1];
      else if (game[state[0]] === undefined && game[state[1]] === 'x' && game[state[2]] === 'x') move = state[0];
      else if (game[state[0]] === 'o' && game[state[1]] === 'o' && game[state[2]] === undefined) move = state[2];
      else if (game[state[0]] === 'o' && game[state[1]] === undefined && game[state[2]] === 'o') move = state[1];
      else if (game[state[0]] === undefined && game[state[1]] === 'o' && game[state[2]] === 'o') move = state[0];
    });
    doMove(cells[move]);
  }

  function randomAiMove() {
    let random = Math.floor(Math.random() * 9);
    while (game[random] === 'o' || game[random] === 'x') random = Math.floor(Math.random() * 9);
    return random;
  }

  function checkWin() {
    let length = game.filter(cell => cell !== undefined).length;
    winStates.forEach(state => {
      if ((game[state[0]] === game[state[1]] && game[state[1]] === game[state[2]]) && (game[state[0]] === 'o' || game[state[0]] === 'x')) {
        end = true;
        if (game[state[0]] === 'o') oWins(state);
        else if (game[state[0]] === 'x') xWins(state);
        field.style.pointerEvents = 'none';
      }
    });
    if (!end && length === 9) {
      message.innerHTML = 'It\'s a draw!';
      field.style.pointerEvents = 'none';
    }
  }

  function oWins(state) {
    setLine(state, 'o');
    message.innerHTML = 'Circle wins!';
    oScoreboard.innerHTML = (++oScore).toString();
    start = 'x';
  }

  function xWins(state) {
    setLine(state, 'x');
    message.innerHTML = 'Cross wins!';
    xScoreboard.innerHTML = (++xScore).toString();
    start = 'o';
  }

  function setLine(pos, type) {
    if (pos === winStates[0]) document.querySelector('span.line.top').classList.add(`${type}-line`);
    else if (pos === winStates[1]) document.querySelector('span.line.middle').classList.add(`${type}-line`);
    else if (pos === winStates[2]) document.querySelector('span.line.bottom').classList.add(`${type}-line`);
    else if (pos === winStates[3]) document.querySelector('span.line.left').classList.add(`${type}-line`);
    else if (pos === winStates[4]) document.querySelector('span.line.center').classList.add(`${type}-line`);
    else if (pos === winStates[5]) document.querySelector('span.line.right').classList.add(`${type}-line`);
    else if (pos === winStates[6]) document.querySelector('span.line.diagonal-left').classList.add(`${type}-line`);
    else if (pos === winStates[7]) document.querySelector('span.line.diagonal-right').classList.add(`${type}-line`);
  }

  function oStarts() {
    turn = 'o';
    field.classList.remove('x-turn');
    field.classList.add('o-turn');
    message.innerHTML = 'Circle starts!';
  }

  function xStarts() {
    turn = 'x';
    field.classList.remove('o-turn');
    field.classList.add('x-turn');
    message.innerHTML = 'Cross starts!';
    if (ai.classList.contains('active')) aiMove();
  }

  function restartGame() {
    restart.classList.add('disabled');
    ai.classList.remove('disabled');
    end = false;
    game = [];
    field.querySelectorAll('span.line').forEach(line => line.classList.remove('o-line', 'x-line'));
    cells.forEach(cell => cell.classList.remove('o', 'x'));
    if (start === 'o') oStarts();
    else xStarts();
    field.style.pointerEvents = 'auto';
  }

  restart.onclick = restartGame;

  function startGame() {
    oScoreboard.innerHTML = oScore.toString();
    xScoreboard.innerHTML = xScore.toString();
    restartGame();
  }

  ai.onclick = () => {
    ai.classList.toggle('active');
  }

  startGame();
}
