// function snake() {
//   const
//     game = document.querySelector('div.game'),
//     play = document.querySelector('i.play');
//
//   let
//     pos,
//     food,
//     width, height,
//     direction = 'right';
//
//   function setDimentions() {
//     width = Math.round(game.offsetWidth / 10);
//     height = Math.round(game.offsetHeight / 10);
//   }
//
//   function setSnake() {
//     game.innerHTML += `<div class="snake" style="left: 0; top: 0;"></div>`;
//   }
//
//   function setFood() {
//     food = [Math.floor(Math.random() * width) * 10, Math.floor(Math.random() * height) * 10];
//     game.innerHTML += `<div class="food" style="left: ${food[0]}px; top: ${food[1]}px;"></div>`;
//   }
//
//   function startMove() {
//
//   }
//
//   play.onclick = () => {
//     play.classList.add('hidden');
//     setDimentions();
//
//     pos = [Math.floor(width / 2) * 10, Math.floor(height / 2) * 10];
//
//     setSnake();
//     setFood();
//     startMove();
//   }
//
//   window.onkeydown = e => {
//     switch (e.key) {
//       case 'ArrowUp' || 'w':
//         direction = 'up';
//         break;
//       case 'ArrowDown' || 's':
//         direction = 'down';
//         break;
//       case 'ArrowLeft' || 'a':
//         direction = 'left';
//         break;
//       case 'ArrowRight' || 'd':
//         direction = 'right';
//         break;
//     }
//
//     console.log(direction);
//   }
//
//   window.onresize = () => {
//     setDimentions();
//   }
//
//   document.body.classList.add('white');
// }

function snake() {
  const
    game = document.querySelector('div.game'),
    play = document.querySelector('i.play');


  function setGame() {
    game.innerHTML += `<div class="row"> ${Array(10).fill('<div class="col"></div>').join('')} </div>`.repeat(10);
  }

  document.body.classList.add('white');
  setGame();
}
