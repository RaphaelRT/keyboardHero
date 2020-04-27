
const buttonPlay = document.querySelector('.play')
const buttonGameOver = document.querySelector('.gameOver')
const columnDiv = document.querySelector('.game')
const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
const lettersVar = [97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122]
const letterColor = ['#55efc4','#81ecec','#74b9ff','#a29bfe','#a29bfe','#487eb0','#00b894','#00cec9','#0984e3','#6c5ce7','#b2bec3','#ffeaa7','#fab1a0','#ff7675','#fd79a8','#636e72','#636e72','#fdcb6e','#e17055','#d63031','#e84393','#2d3436','#F79F1F','#A3CB38','#1289A7','#D980FA','#B53471']
const scoreDiv = document.querySelector('.scoreContainer p')
const serieDiv = document.querySelector('.serieContainer p')
const lifeCursor = document.querySelector('.levelCursor')
const blopSound = document.querySelector('.blop')
const bombSound = document.querySelector('.bomb')
const cashSound = document.querySelector('.cash')
const loseSound = document.querySelector('.lose')
const wrongSound = document.querySelector('.wrong')
const levelChoices = document.querySelectorAll('.levelContainer p')
const limit = document.querySelector('.limit')
const GameMusic = document.querySelector('.gameMusic')
const bestScoreContainer = document.querySelector('.bestScoreContainer p')
const blurDiv = document.querySelector('.blur')
const name = document.querySelector('.name span')
const sound = document.querySelector('.sound')
sound.children[0].src = localStorage.getItem("sound") === "true" ? "./images/volume-on.svg" : "./images/volume-off.svg"
let score = 0
let divImage
let floorPosY = window.innerHeight
let life
let posX
let tabLettersDiv = []
let tabLettersPosY = []
let random
let letterImg
let tabRandom = []
let serie = 0
let game
let index
let letterGravity
let divStyle
let randomLetterValue = []
let level = 1
let gravityForce
let gravitySpeed
let generationSpeed
let topLimit = limit.getBoundingClientRect().top-70;
let bottomLimit = limit.getBoundingClientRect().bottom-5;
let bestScore
let pseudo

sound.addEventListener('click', () => {
  let soundVal = localStorage.getItem('sound') === "true" ? "false" : "true"
  localStorage.setItem('sound', soundVal)
  if (soundVal === "true") {
    sound.children[0].src = "./images/volume-on.svg"
  } else {
    sound.children[0].src = "./images/volume-off.svg"
  }
});



//On check le localStorage pour récupérer le pseudo et le niveau
function saveNameAndLevel() {
  nameAndLevel = JSON.parse(localStorage.getItem('nameAndLevel'))
  pseudo=nameAndLevel[0]
  level=nameAndLevel[1]
}
//On enregistre le meilleur score dans localStorage
function recBestScore(){
  let tempTab = []
  tempTab.push(bestScore)
  tempTab = JSON.stringify(tempTab)
  localStorage.setItem('bestScore',tempTab)
}
//Au chargement de la page on affiche les infos
window.onload = saveNameAndLevel(), levelChoices[1].innerHTML='niveau : '+level,scoreDiv.innerHTML='score : '+score,dispBestScore()
serieDiv.innerHTML='serie : '+serie
//On met un event click sur les balises p pour choisir la difficulté
for (let i = 0; i < levelChoices.length; i++) {
  levelChoices[i].addEventListener('click', function(){
    //En fonction de la balise, on augmente ou on baisse le Niveau
    if (i==0) {
      level--
      if (level<1) {level=1}
  }
    else if (i==2) {
      level++
      if (level>6) {level=6}
    }
    //On applique ça dans le HTML
    levelChoices[1].innerHTML='niveau : '+level
    gameDifficulty()
  })
}
//On écoute le clavier
window.addEventListener('keydown', function(e){
  //On regarde si la lettre tapée est déjà générée
  index = randomLetterValue.indexOf(e.key.charCodeAt(0));

  //si non, vie -1
  if(index===-1){

    serie = 0
    serieDiv.innerHTML = 'série : '+serie
    life--
    lifeBarLevel()
    localStorage.getItem('sound') === 'true' ? wrongSound.play() : null
    if (life<=0) {
      gameOver()
    }
  }
  //si oui, on regarde si c'est une lettre, une bombe ou un bonus, et si la lettre est dans la limite de validation, puis on agit en conséquence sur la vie, la série et les points
  else if (tabLettersDiv[index].className==='divImage' && tabLettersPosY[index]>topLimit && tabLettersPosY[index]<bottomLimit) {
    deleteLetter(index)
    score+=1*level
    gameDifficulty()
    scoreDiv.innerHTML = 'score : '+score
    serie++
    serieDiv.innerHTML = 'série : '+serie
    localStorage.getItem('sound') === 'true' ? blopSound.play() : null
  }
  else if (tabLettersDiv[index].className==='divImage bomb'&&tabLettersPosY[index]>topLimit&&tabLettersPosY[index]<bottomLimit) {

    deleteLetter(index)
    life--
    lifeBarLevel()
    serie=0
    serieDiv.innerHTML = 'série : '+serie
    localStorage.getItem('sound') === 'true' ? bombSound.play() : null
  }
  else if (tabLettersDiv[index].className==='divImage bonus'&&tabLettersPosY[index]>topLimit&&tabLettersPosY[index]<bottomLimit) {
    deleteLetter(index)
    score+=10*level
    gameDifficulty()
    scoreDiv.innerHTML = 'score : '+score
    serie++
    serieDiv.innerHTML = 'série : '+serie
    localStorage.getItem('sound') === 'true' ? cashSound.play() : null
  }
  //si elle n'est pas dans la zone, vie -1 et serie 0
  else{

    life--
    lifeBarLevel()
    serie=0
    serieDiv.innerHTML = 'série : '+serie
    localStorage.getItem('sound') === 'true' ? wrongSound.play() : null
    if (life<=0) {
      gameOver()
    }
  }
  //si la serie est un multiple de 30, on rajoute un vie
  if(serie%30===0 && serie!==0 &&life!==10){life++
  lifeBarLevel()}
})
//On change la difficulté
function gameDifficulty() {
  let slow = 1
  if (level >= 3) {
    slow = 1.8
  }
  gravityForce = (1/2*level+0.5+score/100)* slow
  generationSpeed = (800/(level/3.5)+score) * slow
  gravitySpeed = (15-1/1000*score-0.1/level) * slow
}
//On initialise le jeu
function init() {
  clearInterval(game)
  clearInterval(letterGravity);
  name.innerHTML = JSON.parse(localStorage.getItem("nameAndLevel"))[0].length > 0 ? "🎮 " + JSON.parse(localStorage.getItem("nameAndLevel"))[0] : "🎮 Jean Kevin"
  localStorage.getItem('sound') === 'true' ? GameMusic.play() : null;
  //On supprime les lettres encore sur l'écran
  for (let i = 0; i < tabLettersDiv.length; i++) {
    tabLettersDiv[i].parentNode.removeChild(tabLettersDiv[i])
  }
  //On remet tout à 0
  score = 0
  serie = 0
  life = 10
  gameDifficulty()
  randomLetterValue = []
  tabLettersDiv = []
  tabLettersPosY = []
  tabRandom = []
  dispBestScore()
}
//On affiche le meilleur score
function dispBestScore(){
  //On le récupère dans le localstorage
  bestScore = localStorage.getItem('bestScore')
  //si il existe, on l'affiche
  if(bestScore!=null){
    bestScore = JSON.parse(bestScore)
    bestScoreContainer.innerHTML = 'meilleur : '+bestScore
  }
  //sinon on le set à 0 et on l'affiche
  else{
    bestScore=0
    bestScoreContainer.innerHTML = 'meilleur : '+bestScore
  }
}
//On lance le jeu
function preparePlaying (container) {
  sound.classList.add('hidden');
  levelChoices[0].classList.add('hidden')
  levelChoices[2].classList.add('hidden')
  container.classList.add('hidden')
  columnDiv.classList.remove('pause')
  blurDiv.classList.remove('pause')
  play()
  lifeBarLevel()
}
buttonPlay.addEventListener('click', () => preparePlaying(buttonPlay))
buttonGameOver.addEventListener('click', () => preparePlaying(buttonGameOver))

//On joue
function play(){
  init()
  game = setInterval(function(){
  //letter random
  //Attribution d'une colonne pour chaque lettre
  random = getRandom(0,25)
  if (random===0||random===16) {
    posX = document.querySelector('.column-1')
  }
  else if (random===25||random===22||random===18) {
    posX = document.querySelector('.column-2')
  }
  else if (random===4||random===3||random===23) {
    posX = document.querySelector('.column-3')
  }
  else if (random===15||random===12) {
    posX = document.querySelector('.column-8')
  }
  else if (random===14||random===11) {
    posX = document.querySelector('.column-7')
  }
  else if (random===8||random===10) {
    posX = document.querySelector('.column-6')
  }
  else if (random===17||random===5||random===2||random===19||random===6||random===21) {
    posX = document.querySelector('.column-4')
  }
  else{
    posX = document.querySelector('.column-5')
  }
  // posX = document.querySelector('.column-' + getRandom(1,8))
  generateDiv()},generationSpeed)
  gravity()
}
//random entre deux valeurs données
function getRandom(min, max){
  return Math.floor(Math.random() * (max - min)) + min;
}
//fait tomber les lettres
function gravity(){
  letterGravity = setInterval(function(){
    //On agit sur les lettres une par une
    for (let i = 0; i < tabLettersPosY.length; i++) {
      tabLettersPosY[i]+= gravityForce

      //tant qu'elle n'est pas en bas de l'écran, on la fait descendre
      if (tabLettersPosY[i] < bottomLimit+100){
        tabLettersDiv[i].style.top = tabLettersPosY[i] + 'px'
      }
      //sinon, on regarde si c'est une bombe
      else{
        index=0
        if (tabLettersDiv[index].className==='divImage bomb') {
          deleteLetter(index)
        }
        //si non, on fait perdre une vire et série 0
        else if (tabLettersDiv[index].className==='divImage bonus'||tabLettersDiv[index].className==='divImage') {
          deleteLetter(index)
          serie = 0
          serieDiv.innerHTML = 'série : '+serie
          life--
          lifeBarLevel()
          if (life<=0) {
            gameOver()
          }
        }
      }
    }
  },gravitySpeed)
 }
//génère une div avec image de la lettre
function generateDiv(){
  divImage = document.createElement('div')
  divStyle = Math.floor(Math.random()*100)
  //aléatoire entre bombe, bonus et lettre
  if (divStyle>90) {divImage.setAttribute('class', 'divImage bomb')}
  else if (divStyle>80) {divImage.setAttribute('class', 'divImage bonus')}
  else{divImage.setAttribute('class', 'divImage')}
  //On enregistre tout dans un tableau
  tabLettersDiv.push(divImage)
  tabLettersPosY.push(0)
  posImage()
}
/**
 * @return {string}
 */
function LightenDarkenColor(col, amt) {

  var usePound = false;

  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col,16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if  (r < 0) r = 0;

  var b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if  (b < 0) b = 0;

  var g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

}
//image dans la div et positionnement de la div
function posImage(){
  letterSpan = document.createElement('span')
  letterSpan.setAttribute('class', 'letterSpan')
  letterSvg = document.createElement('img');
  letterImg = new Image()
  //En fonction du type, on attribue une image différente
  if (divStyle>90) {
    letterImg.src = './images/bomb/'+letters[random]+'.png'
    divImage.style.backgroundColor = letterColor[random]
    divImage.style.filter =  "brightness(91%) saturate(64%)"
    letterSpan.innerText = letters[random]
    letterSvg.src="./images/bomb.svg"
    letterSpan.style.textShadow = "7px 4px 0px " + LightenDarkenColor(letterColor[random],-20)
  }
  else if (divStyle>80) {
    letterImg.src = './images/bonus/'+letters[random]+'.png'
    divImage.style.backgroundColor = letterColor[random];
    divImage.style.filter = "sepia(20%) brightness(109%) saturate(110%)"
    letterSpan.innerText = letters[random]
    letterSvg.src="./images/bonus.svg"
    letterSpan.style.textShadow = "7px 4px 0px " + LightenDarkenColor(letterColor[random],-20)
  }
  else{
    divImage.style.backgroundColor = letterColor[random]
    letterSpan.innerText = letters[random]
    letterSpan.style.textShadow = "7px 4px 0px " + LightenDarkenColor(letterColor[random],-20)
  }
  tabRandom.push(random)
  //posX of letters
  posX.appendChild(divImage)
  divImage.appendChild(letterSpan)
  if (letterSvg.src) {
    divImage.appendChild(letterSvg)
  }
  letterImg.style.width = 66 + 'px'
  if (divStyle>90) {letterImg.style.width = 66 + 'px'}
  else if (divStyle>80) {letterImg.style.width = 72 + 'px'}
  else{letterImg.style.width = 66 + 'px'}
  randomLetterValue.push(lettersVar[random])
}
//On supprime la lettre dans le tableau, sa position et sa div
function deleteLetter(index) {
  //On supprime la lettre tapée
  tabLettersDiv[index].parentNode.removeChild(tabLettersDiv[index])
  tabLettersDiv.splice(index,1)
  tabLettersPosY.splice(index,1)
  tabRandom.splice(index,1)
  randomLetterValue.splice(index,1)
}
//On agit sur la barre de vie
function lifeBarLevel() {
  if (life===-1) {life=0}
  lifeCursor.style.top = 100-life*10 + '%'
}
//perdu
function gameOver() {
  buttonGameOver.classList.remove('hidden')
  sound.classList.remove('hidden')
  levelChoices[0].classList.remove('hidden')
  levelChoices[2].classList.remove('hidden')
  columnDiv.classList.add('pause')
  if (score>bestScore){
    bestScore=score
    recBestScore()
  }
  init()
  blurDiv.classList.add('pause')
  GameMusic.pause();
  localStorage.getItem('sound') === 'true' ? loseSound.play() : null;
  loseSound.addEventListener('ended',function(){
    GameMusic.play()

  });
}
