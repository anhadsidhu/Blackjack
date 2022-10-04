// constant
const maxScore = 21;
const points = {
    'A': 1,
    '02': 2,
    '03': 3,
    '04': 4,
    '05': 5,
    '06': 6,
    '07': 7,
    '08': 8,
    '09': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10,
}

//state variables
let gameStart;
let gameEnd;
let playerWin;
let playerCards;
let dealerCards;
let playerScore;
let dealerScore;
let winningMessage;

// DOM Elements
let textArea = document.getElementById('text-area');
let startGame = document.getElementById('start-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');
let restartButton = document.getElementById('restart-button')
let playerContent = document.getElementById('player')
let dealerContent = document.getElementById('dealer')
let playerCardsText = document.getElementById('player-cards-text')
let dealerCardsText = document.getElementById('dealer-cards-text')
let startGameButton = document.querySelector('#start-button')
let playerCardsHand = document.getElementById('player-cards')
let dealerCardsHand = document.getElementById('dealer-cards')
let playerScoreCount = document.getElementById('player-score')
let dealerScoreCount = document.getElementById('dealer-score')
let game = document.querySelector('#game')

// EventListeners
hitButton.addEventListener('click', playerHitOne);
startGameButton.addEventListener('click', hidP)
stayButton.addEventListener('click', stayCards)
restartButton.addEventListener('click',restart)
startGameButton.addEventListener('click', ()=>{
    startGameButton.style.display = 'none';
    hitButton.style.display = 'block';
    stayButton.style.display = 'block';
    restartButton.style.display = 'block';
    playerContent.style.display ='contents';
    dealerContent.style.display = 'contents';
})

class Card{
    constructor(suit, value){
        this.suit = suit
        this.value = value
    }
    toString(){
        return `${this.value} of ${this.suit}`
    }
}

class Deck{
    static suits = ['clubs', 'hearts', 'diamonds', 'spades']
    static values = ['A', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q','K']
    constructor(){
        this.deck = []
        for(let suit of Deck.suits){
            for(let value of Deck.values){
                let card = new Card(suit, value)
                this.deck.push(card)
            }
        }
        this.shuffle()
    }

    shuffle(){
          for( let i = 0; i < this.deck.length;i++){
            let randomIdx = Math.floor(Math.random() * 52)
            let tempCard = this.deck[i];
            this.deck[i] = this.deck[randomIdx];
            this.deck[randomIdx] = tempCard;
        }
    }

    deal(number){
        let drawnHand = [];
        for(let i = 0; i < number; i ++){
            drawnHand.push(this.deck.shift())
        }
        return drawnHand
    }
}

function init(){
    const dealtDeck = new Deck();
    playerCards = [];
    dealerCards = [];
    dealerCards.push(...dealtDeck.deal(2))
    playerCards.push(...dealtDeck.deal(2))
    gameStart = false;
    gameEnd = false;
    playerWin = false;
    playerScore = 0;
    dealerScore = 0;
    winningMessage = ''
    playerContent.style.display = 'none';
    dealerContent.style.display = 'none';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
    restartButton.style.display = 'none';
}

function hidP(){
    let el = document.getElementById('hidden');
        el.style.display = 'none';
}

function startCardPlayer(){
       playerCards.forEach(function(card){
           let cardClass = 'card large'
           if(['A', 'K', 'Q', 'J'].includes(card.value)){
               cardClass += ` ${card.suit} ${card.value}`
           }
           else{
               cardClass += ` ${card.suit} r${card.value}`
           }
           //create a div element
           const divEl = document.createElement('div')
           divEl.className = cardClass

           //append to the DOM
           playerCardsHand.appendChild(divEl)
       })
}

function startCardDealer(){
    dealerCards.forEach(function(card){
        let cardClass = 'card large'
        if(['A', 'K', 'Q', 'J'].includes(card.value)){
            cardClass += ` ${card.suit} ${card.value}`
        }
        else{
            cardClass += ` ${card.suit} r${card.value}`
        }
        const divEl = document.createElement('div')
        divEl.className = cardClass
        dealerCardsHand.appendChild(divEl)
    })
}

function playerHitOne(){
    const dealtDeck = new Deck();
    const hand = dealtDeck.deal(1)
    playerCards.push(hand[0]);
     endOfGameCheck();
    playerAppend(playerCards)
    playerScoreCount.innerText = playerScore
}

function dealerHitOne(){
    const dealtDeck = new Deck();
    const hand = dealtDeck.deal(1)
    dealerCards.push(hand[0]);
    endOfGameCheck();
    dealerAppend(dealerCards)
    dealerScoreCount.innerText = dealerScore
}

function playerAppend(appendingArray){
    let cardClass = 'card large'
           if(['A', 'K', 'Q', 'J'].includes(playerCards[playerCards.length - 1].value)){
               cardClass += ` ${playerCards[playerCards.length - 1].suit} ${playerCards[playerCards.length - 1].value}`
           }
           else{
               cardClass += ` ${playerCards[playerCards.length - 1].suit} r${playerCards[playerCards.length - 1].value}`
           }
           const divEl = document.createElement('div')
           divEl.className = cardClass
            playerCardsHand.appendChild(divEl)
}

function dealerAppend(appendingArray){
    let cardClass = 'card large'
           if(['A', 'K', 'Q', 'J'].includes(dealerCards[dealerCards.length - 1].value)){
               cardClass += ` ${dealerCards[dealerCards.length - 1].suit} ${dealerCards[dealerCards.length - 1].value}`
           }
           else{
               cardClass += ` ${dealerCards[dealerCards.length - 1].suit} r${dealerCards[dealerCards.length - 1].value}`
           }
           const divEl = document.createElement('div')
           divEl.className = cardClass
           dealerCardsHand.appendChild(divEl)
}

function stayCards(){
    dealerHitOne();
    endOfGameCheck();
};

function removeOldHand(){
   while(dealerCardsHand.firstChild){
    dealerCardsHand.removeChild(dealerCardsHand.firstChild)
   }
   while(playerCardsHand.firstChild){
    playerCardsHand.removeChild(playerCardsHand.firstChild)
   }
}

function scoresOfPlayers(hand){
    let cardsPoints = 0;
    let aceCard = false;
    for( let i = 0; i < hand.length; i++){
        let card = hand[i];
        console.log(card)
        cardsPoints += points[card.value]
        if(card.value == 'A'){
            aceCard = true;
        }
    }
    return cardsPoints
}

function updatedPoints(){
    playerScore = scoresOfPlayers(playerCards)
    dealerScore = scoresOfPlayers(dealerCards)
}

function endOfGameCheck(){
    updatedPoints()

    if((playerScore === maxScore && dealerScore === maxScore) || (playerScore === dealerScore && playerScore < maxScore )){
        gameEnd = true;
        winningMessage = 'It is a Tie!!'
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';

    }else if(playerScore > maxScore || dealerScore === maxScore){
       playerWin = false;
       gameEnd = true;
       winningMessage = 'Dealer Wins!!!'
       hitButton.style.display = 'none';
       stayButton.style.display = 'none';

    }else if(dealerScore > maxScore || playerScore === maxScore){
        playerWin = true;
        gameEnd = true;
        winningMessage = 'Player Wins!!!'
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
    textArea.innerText = winningMessage
}

function restart(){
    removeOldHand()
    const dealtDeck = new Deck();
    playerCards = [];
    dealerCards = [];
    console.log(playerCards)
    console.log(dealerCards)
    dealerCards.push(...dealtDeck.deal(2))
    playerCards.push(...dealtDeck.deal(2))
    gameStart = false;
    gameEnd = false;
    playerWin = false;
    playerScore = 0;
    dealerScore = 0;
    render()
}

function render(){
    startCardDealer();
    startCardPlayer();
    endOfGameCheck();
    playerScoreCount.innerText = playerScore
    dealerScoreCount.innerText = dealerScore
}

init()
render()









