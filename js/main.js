const langButton = document.querySelector('div.lang-button');

function setLang(lang) {
  langButton.querySelector('img').src = `/dist/img/${lang}.png`;
  document.querySelector('html').lang = lang;
  localStorage.setItem('lang', lang);
}

langButton.onclick = () => {
  if (document.querySelector('html').lang === 'en') setLang('nl');
  else setLang('en');
}

window.onload = () => {
  setLang(localStorage.getItem('lang') || navigator.language.slice(0, 2) || 'en');
  let location = window.location.href.split('/')[3];
  if (location && location !== 'home') document.querySelector('a.back-button').classList.remove('hidden');
  if (location === 'blackjack') blackjack();
  else if (location === 'hangman') hangman();
  else if (location === 'snake') snake();
  else if (location === 'tictactoe') ticTacToe();
}
