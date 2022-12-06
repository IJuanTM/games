function blackjack() {
  const
    suits = ['heart', 'spade', 'diamond', 'club'],
    ranks = ['A11', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const getDeck = () => {
    const deck = [];
    for (let suit of suits) for (let rank of ranks) deck.push({suit, rank});
    return shuffleDeck(deck);
  }

  const shuffleDeck = deck => {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  let turn, playerHand, dealerHand, splitHand, decks;

  const getCard = () => {
    let
      card = decks[Math.floor(Math.random() * decks.length)].pop(),
      hand = turn === 'player' ? playerHand : turn === 'split' ? splitHand : dealerHand;
    if ((calculateScore(hand) + (card.rank === 'A11' ? 11 : card.rank === 'J' || card.rank === 'Q' || card.rank === 'K' ? 10 : parseInt(card.rank))) > 21) {
      if (card.rank === 'A11') card.rank = 'A1';
      if ((calculateScore(hand) + (card.rank === 'A1' ? 1 : card.rank === 'J' || card.rank === 'Q' || card.rank === 'K' ? 10 : parseInt(card.rank))) > 21) {
        hand.forEach(handCard => {
          if (handCard.rank === 'A11') handCard.rank = 'A1';
        });
      }
    }
    card.rank === 'A11' || card.rank === 'A1' ? card.type = 'ace'
      : card.rank === 'J' || card.rank === 'Q' || card.rank === 'K' ? card.type = 'special'
        : card.type = 'number';
    return card;
  }

  const newPlayingCard = (suit, rank, type, down) => {
    let card = `
    <div class="card ${suit === 'heart' || suit === 'diamond' ? 'red' : 'black'} ${down ? 'down' : 'up'} f-0" style="transform: rotateZ(${Math.floor(Math.random() * (2 - -2 + 1) + -2) / 2}deg)">
      <div class="card-content">
        <div class="card-front">
          <div class="row">
            <div class="col card-header">
              <div class="row">
  `;
    if (suit === 'heart') card += `<div class="col suit center-x f-0">${heart}</div>`;
    if (suit === 'spade') card += `<div class="col suit center-x f-0">${spade}</div>`;
    if (suit === 'diamond') card += `<div class="col suit center-x f-0">${diamond}</div>`;
    if (suit === 'club') card += `<div class="col suit center-x f-0">${club}</div>`;
    card += `
              </div>
              <div class="row">
                <div class="col value center-x f-0">${rank === 'A11' || rank === 'A1' ? 'A' : rank}</div>
              </div>
            </div>
          </div>
          <div class="row face-row center f-g">
            <div class="col face center">
  `;
    if (type === 'ace') {
      if (suit === 'heart') card += heart;
      if (suit === 'spade') card += spade;
      if (suit === 'diamond') card += diamond;
      if (suit === 'club') card += club;
    } else if (type === 'special') {
      if (rank === 'J') card += jack;
      if (rank === 'Q') card += queen;
      if (rank === 'K') card += king;
    } else if (type === 'number') for (let i = 0; i < rank; i++) card += `<span class="line"></span>`;
    card += `
            </div>
          </div>
          <div class="row">
            <div class="col card-footer">
              <div class="row end-x">
                <div class="col value center-x f-0">${rank === 'A11' || rank === 'A1' ? 'A' : rank}</div>
              </div>
              <div class="row end-x">
  `;
    if (suit === 'heart') card += `<div class="col suit center-x f-0">${heart}</div>`;
    if (suit === 'spade') card += `<div class="col suit center-x f-0">${spade}</div>`;
    if (suit === 'diamond') card += `<div class="col suit center-x f-0">${diamond}</div>`;
    if (suit === 'club') card += `<div class="col suit center-x f-0">${club}</div>`;
    card += `
              </div>
            </div>
          </div>
        </div>
        <div class="card-back">
          <div class="row face-row center f-g">
            <div class="col face center">
  `;
    for (let i = 0; i < 24; i++) card += `<span class="line line-back"></span>`;
    card += `
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    return card;
  }

  const
    playerCards = document.querySelector('div.player-cards'),
    dealerCards = document.querySelector('div.dealer-cards'),
    splitCards = document.querySelector('div.split-cards'),
    handValue = document.querySelector('div.hand-value'),
    splitValue = document.querySelector('div.split-value');

  const dealCard = (card, down) => {
    let newCard = newPlayingCard(card.suit, card.rank, card.type, down);
    if (turn === 'player') {
      playerCards.innerHTML += newCard;
      playerHand.push(card);
    } else if (turn === 'split') {
      splitCards.innerHTML += newCard;
      splitHand.push(card);
      splitValue.innerHTML = calculateScore(splitHand).toString();
      if (checkIfAce(splitHand)) splitValue.innerHTML = `S${calculateScore(splitHand).toString()}`;
      else splitValue.innerHTML = `H${calculateScore(splitHand).toString()}`;
    } else {
      dealerCards.innerHTML += newCard;
      dealerHand.push(card);
    }
    if (checkIfAce(playerHand)) handValue.innerHTML = `S${calculateScore(playerHand).toString()}`;
    else handValue.innerHTML = `H${calculateScore(playerHand).toString()}`;
    addTilt();
  }

  const checkIfAce = (hand) => {
    let ace = false;
    hand.forEach(card => {
      if (card.rank === 'A11') ace = true;
    });
    return ace;
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  const
    hitButton = document.querySelector('div.option.hit'),
    standButton = document.querySelector('div.option.stand'),
    doubleButton = document.querySelector('div.option.double'),
    splitButton = document.querySelector('div.option.split'),
    betAmount = document.querySelector('input.bet-amount'),
    gameMessage = document.querySelector('div.message'),
    playerChips = document.querySelector('div.player-chips');

  const dealCards = () => {
    turn = 'player';
    dealCard(getCard(), false);
    setTimeout(() => {
      turn = 'dealer';
      dealCard(getCard(), false);
    }, 500);
    setTimeout(() => {
      turn = 'player';
      dealCard(getCard(), false);
    }, 1000);
    setTimeout(() => {
      turn = 'dealer';
      dealCard(getCard(), true);
    }, 1500);
    setTimeout(() => {
      turn = 'player';
      if (calculateScore(playerHand) === 21) gameEnd('Blackjack!', 'blackjack');
      else {
        playerCards.classList.add('active');
        hitButton.classList.remove('disabled');
        standButton.classList.remove('disabled');
        if (parseInt(betAmount.value) && (parseInt(localStorage.getItem('playerChips')) >= parseInt(betAmount.value))) doubleButton.classList.remove('disabled');
        if (playerHand[0].rank === playerHand[1].rank) {
          if (parseInt(betAmount.value)) {
            if (parseInt(localStorage.getItem('playerChips')) >= parseInt(betAmount.value)) splitButton.classList.remove('disabled');
          } else splitButton.classList.remove('disabled');
        }
      }
    }, 2000);
  }

  hitButton.onclick = () => {
    if (turn === 'split') {
      dealCard(getCard(), false);
      if (calculateScore(splitHand) > 21) {
        gameMessage.innerHTML = `Split hand bust with ${calculateScore(playerHand)}`;
        setTimeout(() => gameMessage.innerHTML = '', 5000);
        if (parseInt(betAmount.value)) betAmount.value = parseInt(betAmount.value) / 2;
        turn = 'player';
        splitCards.classList.remove('active');
        playerCards.classList.add('active');
      }
    } else {
      doubleButton.classList.add('disabled');
      splitButton.classList.add('disabled');
      dealCard(getCard(), false);

      if (splitHand.length) {
        // let message = '';
        // if (calculateScore(playerHand) > 21) {
        //   message = `Main hand bust with ${calculateScore(playerHand)}`;
        //   if (calculateScore(splitHand) > 21) message += ` | Split hand bust with ${calculateScore(splitHand)}`;
        //   else message += ` | Split hand wins with ${calculateScore(splitHand)}`;
        // } else if (calculateScore(splitHand) > 21) {
        //   if (calculateScore(playerHand) > 21) message = `Main hand bust with ${calculateScore(playerHand)}`;
        //   else message = `Main hand wins with ${calculateScore(splitHand)}`;
        //   message += ` | Split hand bust with ${calculateScore(splitHand)}`;
        // }
        // if (message) gameEnd(message, 'bust');
      } else if (calculateScore(playerHand) > 21) gameEnd(`You bust with ${calculateScore(playerHand)}`, 'lose');
    }
  }

  standButton.onclick = () => {
    if (turn === 'split') {
      turn = 'player';
      splitCards.classList.remove('active');
      playerCards.classList.add('active');
    } else {
      disableButtons();
      dealerPlays();
    }
  }

  doubleButton.onclick = () => {
    dealCard(getCard(), false);
    localStorage.setItem(
      'playerChips',
      (parseInt(localStorage.getItem('playerChips')) - parseInt(betAmount.value)).toString()
    );
    playerChips.innerHTML = localStorage.getItem('playerChips');
    betAmount.value = parseInt(betAmount.value) * 2;
    if (calculateScore(playerHand) > 21) gameEnd(`You bust with ${calculateScore(playerHand)}`, 'lose');
    else {
      disableButtons();
      dealerPlays();
    }
  }

  splitButton.onclick = () => {
    turn = 'split';
    splitButton.classList.add('disabled');
    doubleButton.classList.add('disabled');
    splitCards.innerHTML = playerCards.children[1].outerHTML;
    playerCards.children[1].remove();
    splitHand.push(playerHand.pop());
    if (checkIfAce(playerHand)) handValue.innerHTML = `S${calculateScore(playerHand).toString()}`;
    else handValue.innerHTML = `H${calculateScore(playerHand).toString()}`;
    playerCards.classList.remove('active');
    splitCards.classList.add('active');
    splitCards.classList.remove('hidden');
    splitValue.classList.remove('hidden');
    if (checkIfAce(splitHand)) splitValue.innerHTML = `S${calculateScore(splitHand).toString()}`;
    else splitValue.innerHTML = `H${calculateScore(splitHand).toString()}`;
    addTilt();
    if (parseInt(betAmount.value)) {
      localStorage.setItem('playerChips', (parseInt(localStorage.getItem('playerChips')) - parseInt(betAmount.value)).toString());
      playerChips.innerHTML = localStorage.getItem('playerChips');
      betAmount.value = parseInt(betAmount.value) * 2;
    }
  }

  const calculateScore = cards => {
    let score = 0;
    for (let card of cards) {
      if (card.rank === 'A11') score += 11;
      else if (card.rank === 'A1') score += 1;
      else if (card.type === 'special') score += 10;
      else score += parseInt(card.rank);
    }
    return score;
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  const
    dealButton = document.querySelector('div.option.deal'),
    lastChange = document.querySelector('div.last-change'),
    totalChange = document.querySelector('div.total-change');

  const gameEnd = (message, type) => {
    disableButtons();
    gameMessage.innerHTML = message;
    setTimeout(() => gameMessage.innerHTML = '', 5000);
    if (type === 'win' && parseInt(betAmount.value)) {
      localStorage.setItem(
        'playerChips',
        (parseInt(localStorage.getItem('playerChips')) + (parseInt(betAmount.value) * 2)).toString()
      );
      lastChange.innerHTML = `+ ${parseInt(betAmount.value)}`;
      setTotalChange(parseInt(betAmount.value));
    } else if (type === 'blackjack' && parseInt(betAmount.value)) {
      localStorage.setItem(
        'playerChips',
        (parseInt(localStorage.getItem('playerChips')) + (parseInt(betAmount.value) * 2.5)).toString()
      );
      lastChange.innerHTML = `+ ${parseInt(betAmount.value) * 1.5}`;
      setTotalChange(parseInt(betAmount.value) * 1.5);
    } else if (type === 'push' && parseInt(betAmount.value)) {
      localStorage.setItem(
        'playerChips',
        (parseInt(localStorage.getItem('playerChips')) + parseInt(betAmount.value)).toString()
      );
      lastChange.innerHTML = '&plusmn; 0';
    } else if (type === 'lose' && parseInt(betAmount.value)) {
      lastChange.innerHTML = `- ${parseInt(betAmount.value)}`;
      setTotalChange(-parseInt(betAmount.value));
    }
    playerChips.innerHTML = localStorage.getItem('playerChips');
    if (localStorage.getItem('rememberBet') === 'false') betAmount.value = '';
    betAmount.disabled = false;
    playerCards.classList.remove('active');
    dealButton.classList.remove('disabled');
  }

  const setTotalChange = amount => {
    if (localStorage.getItem('totalChange')) localStorage.setItem('totalChange', (parseInt(localStorage.getItem('totalChange')) + parseInt(amount)).toString());
    else localStorage.setItem('totalChange', amount);
    totalChange.innerHTML =
      localStorage.getItem('totalChange') > 0 ? `+ ${localStorage.getItem('totalChange')}`
        : localStorage.getItem('totalChange') < 0 ? `- ${Math.abs(parseInt(localStorage.getItem('totalChange')))}`
          : '&plusmn; 0';
  }

  const dealerPlays = () => {
    turn = 'dealer';
    dealerCards.querySelector('div.card.down').classList.remove('down');
    setTimeout(() => dealerHit(), 500);
  }

  const dealerHit = () => {
    if (calculateScore(dealerHand) < 17) {
      setTimeout(() => dealCard(getCard(), false), 500);
      setTimeout(() => dealerHit(), 1000);
    } else if (calculateScore(dealerHand) > 21) gameEnd(`Dealer bust with ${calculateScore(dealerHand)}`, 'win');
    else if (calculateScore(dealerHand) >= 17) {
      if (calculateScore(dealerHand) > calculateScore(playerHand)) gameEnd(`Dealer wins with ${calculateScore(dealerHand)}`, 'lose');
      else if (calculateScore(dealerHand) === calculateScore(playerHand)) gameEnd(`Pushed, both had ${calculateScore(playerHand)}`, 'push');
      else gameEnd(`You win with ${calculateScore(playerHand)}`, 'win');
    } else gameEnd(`Dealer bust with ${calculateScore(dealerHand)}`, 'win');
  }

  const disableButtons = () => {
    hitButton.classList.add('disabled');
    standButton.classList.add('disabled');
    doubleButton.classList.add('disabled');
    splitButton.classList.add('disabled');
  }

  const addTilt = () => {
    VanillaTilt.init(document.querySelectorAll('div.card'), {
      max: 2.5,
      speed: 500,
      gyroscope: false
    });
  }

  dealButton.onclick = () => {
    gameMessage.innerHTML = '';
    if (betAmount.value) {
      if (parseInt(betAmount.value) > parseInt(localStorage.getItem('playerChips'))) {
        gameMessage.innerHTML = 'You don\'t have enough chips!';
        setTimeout(() => gameMessage.innerHTML = '', 5000);
        return;
      } else setBet();
    }
    dealButton.classList.add('disabled');
    playerCards.innerHTML = '';
    dealerCards.innerHTML = '';
    splitCards.classList.add('hidden');
    splitCards.innerHTML = '';
    playerHand = [];
    dealerHand = [];
    splitHand = [];
    decks = [getDeck(), getDeck(), getDeck(), getDeck()];
    dealCards();
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  const setBet = () => {
    if (parseInt(betAmount.value) > 0) {
      if (parseInt(betAmount.value) <= parseInt(localStorage.getItem('playerChips'))) {
        localStorage.setItem('playerChips', (parseInt(localStorage.getItem('playerChips')) - parseInt(betAmount.value)).toString());
        playerChips.innerHTML = localStorage.getItem('playerChips');
        betAmount.disabled = true;
      } else {
        gameMessage.innerHTML = 'You don\'t have enough chips!';
        setTimeout(() => gameMessage.innerHTML = '', 2000);
      }
    } else {
      gameMessage.innerHTML = 'Please enter a valid bet';
      setTimeout(() => gameMessage.innerHTML = '', 2000);
    }
  }

  // -------------------------------------------------------------------------------------------------------------------------------- //

  const rememberButton = document.querySelector('input.remember-bet');

  rememberButton.oninput = () => {
    if (rememberButton.checked) localStorage.setItem('rememberBet', 'true');
    else localStorage.setItem('rememberBet', 'false');
  }

  document.onkeydown = e => {
    if (e.keyCode === 32) if (!dealButton.classList.contains('disabled')) dealButton.onclick();
    if (e.keyCode === 49) if (!hitButton.classList.contains('disabled')) hitButton.onclick();
    if (e.keyCode === 50) if (!standButton.classList.contains('disabled')) standButton.onclick();
    if (e.keyCode === 51) if (!doubleButton.classList.contains('disabled')) doubleButton.onclick();
    if (e.keyCode === 52) if (!splitButton.classList.contains('disabled')) splitButton.onclick();
  }

  document.body.classList.add('white');
  if (!localStorage.getItem('rememberBet')) localStorage.setItem('rememberBet', 'false');
  rememberButton.checked = localStorage.getItem('rememberBet') === 'true';
  if (!localStorage.getItem('playerChips')) localStorage.setItem('playerChips', '10000');
  playerChips.innerHTML = localStorage.getItem('playerChips');
}
