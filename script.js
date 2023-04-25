const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const colors = [
  "attack",
  "relay",
  "reconvene",
  "fight",
  "block",
];
const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(
  " | "
)};`;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let gameStarted = false;
const errorText = document.querySelector('.lang-text-wrap p');
const transcriptText = document.querySelector('.lang-text-wrap h5');
const dragonSection = document.querySelector('.dragon-section');
const dragonHealthGuage = document.querySelector('.health-guage-wrap .health-guage');
const langText = document.querySelector('.lang-text-wrap h1');
const dragonBreath = document.querySelector('.fire-path-wrap img');
const dragonBreathSound = new Audio('./assets/QCZSWV4-dragon-breath.mp3');
const knightShieldSound = new Audio('./assets//shielddrop-94887.mp3');
const punchSound = new Audio('./assets/punch-140236.mp3');
const knightShield = document.getElementById('knightShield');

let i = 0;

let fireEls = [];
const breathFire = () => {
  const attackWithDragonBreath = () => {
    const firePath = document.querySelector('.fire-path-wrap');
    const fireEl = document.createElement('img');
    fireEl.src = './assets/42600.svg';
    fireEl.className = 'dragon-fire';
    firePath.appendChild(fireEl);
    fireEls.push(fireEl);
    dragonBreathSound.play();
  }
  if (gameStarted) attackWithDragonBreath();
};

setInterval(breathFire, 8000);
setInterval(() => {
  if (gameStarted) fireEls.pop();
}, 10000);

const initGame = () => {
  const dragonImg = document.querySelector('.dragon-illustration-wrapper');
  dragonImg.classList.remove('animate__shakeX');
  langText.classList.remove('animate__bounceInDown');

  let wordToSpeak = colors[i];
  langText.textContent = `${wordToSpeak}!`;

  langText.classList.add('animate__bounceInDown');

  const handleSpeechResult = (event) => {
    const word = event.results[0][0].transcript;
    transcriptText.textContent = `You said ${word}`;
    const wordsMatch = word === wordToSpeak;
    const percentageToRemove = 100 - (i + 1) * 20;
    if (wordsMatch) {
      dragonHealthGuage.style.width = `${percentageToRemove}%`;
      dragonImg.classList.add('animate__shakeX');
      stagePassed = true;
      punchSound.play();
      i++;
      if (i === 5) endGame();
    }
    if (word === 'shield') {
      fireEls[0]?.classList.add('shield-fire');
      knightShieldSound.play();
    }
  }
  recognition.onresult = handleSpeechResult;
}

const endGame = () => {
  dragonSection.classList.add('animate__fadeOutRight');
  langText.textContent = 'Congratulations You Win!';
  langText.classList.add('animate__bounceOut');
  i = 0;
  gameStarted = false;
}

const startAttack = () => {
  try {
    recognition.start();
    gameStarted = true;
    initGame();
  } catch(err) {
    console.log(err?.message);
    errorText.textContent = `${err?.message}, Please refresh page`;
  }
};

document.addEventListener('click', startAttack);

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  errorText.textContent = "Word not recognised";
}

recognition.onerror = function(event) {
  errorText.textContent = 'an error occured, did not get the word, try again quick'
}

