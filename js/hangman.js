function hangman() {
  const
    // languagePopup = document.querySelector('div.language-popup'),
    languageSwitch = document.querySelector('span.language-switch'),
    // randomPopup = document.querySelector('div.random-popup'),
    randomWord = document.querySelector('i.random-word'),
    wordDisplay = document.querySelector('h1.word'),
    wordForm = document.querySelector('form.word-form'),
    loading = document.querySelector('span.loading'),
    wordInput = document.querySelector('input.word-input'),
    playIcon = document.querySelector('i.play-icon'),
    gameImage = document.querySelector('img.game-image'),
    keys = document.querySelectorAll('div.keyboard div.col'),
    guesses = document.querySelectorAll('div.guess'),
    lossCount = document.querySelector('div.losses'),
    winCount = document.querySelector('div.wins');

  let
    languageSwitched = false,
    randomWordClicked = false,
    gameLanguage = 'en',
    wordToGuess = 'hangman',
    guessCount = 0;

  // -------------------------------------------------------------------------------------------------------------------------------- //

  // async function fetchEnglishWord() {
  //   return fetch(`https://random-word-api.herokuapp.com/word?number=1&length=${Math.floor(Math.random() * 8) + 3}`)
  //     .then(response => response.json());
  // }
  //
  // async function fetchDutchWord() {
  //   return fetch('../dist/docs/words.txt')
  //     .then(response => response.text())
  //     .then(text => text.split('\n'))
  //     .then(words => words.filter(word => word.length >= 3 && word.length <= 10 && word.match('^[a-z- ]+$')));
  // }

  async function fetchWord(source) {
    return fetch(`../dist/docs/${source}.txt`)
      .then(response => response.text())
      .then(text => text.split('\n'))
      .then(words => words.filter(word => word.length >= 3 && word.length <= 10 && word.match('^[a-z- ]+$')))
      .then(words => words[Math.floor(Math.random() * words.length)]);
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  function inWord(letter) {
    let inWord = false;
    wordDisplay.querySelectorAll('span').forEach(span => {
      if (span.innerHTML === letter) {
        span.classList.remove('to-be-guessed');
        inWord = true;
      }
    });
    return inWord;
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  function newWordReset() {
    wordForm.style.display = 'none';
    wordInput.value = '';
    wordDisplay.style.display = 'flex';
    playIcon.classList.replace('fa-play', 'fa-arrows-rotate');
    playIcon.style.display = 'flex';
    languageSwitch.classList.add('in-play');
    randomWord.style.display = 'none';
    keys.forEach(key => key.classList.remove('disabled'));
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  function switchLanguage() {
    gameLanguage = gameLanguage === 'en' ? 'nl' : 'en';
    languageSwitch.querySelector('img').src = `../dist/img/${gameLanguage}.png`;
  }

  languageSwitch.onclick = () => {
    languageSwitched = true;
    // languagePopup.style.display = 'none';
    switchLanguage();
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  function setNewWord() {
    wordDisplay.innerHTML = wordToGuess.split('').map(letter => {
      if (letter === ' ') return '<span class="space"></span>';
      else if (letter === '-') return '<span class="dash">-</span>';
      return `<span class="to-be-guessed">${letter}</span>`;
    }).join('');
    newWordReset();
  }

  randomWord.onclick = async () => {
    randomWordClicked = true;
    wordForm.style.display = 'none';
    randomWord.style.display = 'none';
    // randomPopup.style.display = 'none';
    // languagePopup.style.display = 'none';
    languageSwitch.style.display = 'none';
    languageSwitch.classList.add('in-play');
    if (gameLanguage === 'en') {
      loading.innerHTML = 'loading...';
      loading.style.display = 'flex';
      wordToGuess = await fetchWord('words');
    } else {
      loading.innerHTML = 'laden...';
      loading.style.display = 'flex';
      wordToGuess = await fetchWord('woorden');
    }
    setNewWord();
    loading.style.display = 'none';
    languageSwitch.style.display = 'flex';
  }

  wordForm.onsubmit = event => {
    event.preventDefault();
    if (wordInput.value && wordInput.value.length >= 3 && wordInput.value.length <= 10 && wordInput.value.match('^[a-z-A-Z- ]+$')) {
      wordToGuess = wordInput.value.toLowerCase();
      setNewWord();
      wordInput.value = '';
      languageSwitch.style.display = 'none';
    } else {
      wordInput.classList.add('error');
      setTimeout(() => {
        wordInput.classList.remove('error');
      }, 2000);
    }
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  playIcon.onclick = () => {
    // document.querySelector('div.start-popup').style.display = 'none';
    playIcon.style.display = 'none';
    guessCount = 0;
    guesses.forEach(guess => guess.classList.remove('used'));
    wordDisplay.style.display = 'none';
    wordDisplay.classList.remove('win', 'lose');
    wordForm.style.display = 'flex';
    if (!('ontouchstart' in document.documentElement)) wordInput.focus();
    languageSwitch.classList.remove('in-play');
    languageSwitch.style.display = 'flex';
    // if (!languageSwitched) languagePopup.style.display = 'flex';
    randomWord.style.display = 'flex';
    // if (!randomWordClicked) randomPopup.style.display = 'flex';
    gameImage.src = '../dist/img/0.png';
    keys.forEach(key => key.classList.add('disabled'));
    keys.forEach(key => key.classList.remove('incorrect', 'correct'));
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  keys.forEach(key => {
    key.onclick = () => {
      if (inWord(key.innerHTML)) {
        key.classList.add('correct');
        if (wordDisplay.querySelectorAll('span:not(.to-be-guessed)').length === wordToGuess.length) {
          wordDisplay.classList.add('win');
          winCount.innerHTML = (parseInt(winCount.innerHTML) + 1).toString();
          keys.forEach(key => key.classList.add('disabled'));
        }
      } else {
        key.classList.add('incorrect');
        guesses[guessCount].classList.add('used');
        guessCount++;
        gameImage.src = `../dist/img/${guessCount}.png`;
        if (guessCount > 10) {
          wordDisplay.classList.add('lose');
          wordDisplay.querySelectorAll('span').forEach(span => span.classList.remove('to-be-guessed'));
          lossCount.innerHTML = (parseInt(lossCount.innerHTML) + 1).toString();
          keys.forEach(key => key.classList.add('disabled'));
        }
      }
    }
  });

  // -------------------------------------------------------------------------------------------------------------------------------- //

  document.onkeydown = event => {
    for (let i = 0; i < keys.length; i++)
      if (keys[i].innerHTML === event.key)
        if (!keys[i].classList.contains('incorrect') && !keys[i].classList.contains('correct') && !keys[i].classList.contains('disabled'))
          keys[i].click();
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  wordDisplay.innerHTML = wordToGuess.split('').map(letter => `<span>${letter}</span>`).join('');
  wordToGuess.split('').forEach(letter => {
    for (let i = 0; i < keys.length; i++)
      if (keys[i].innerHTML === letter)
        keys[i].classList.add('correct');
  });
  keys.forEach(key => key.classList.add('disabled'));
}
