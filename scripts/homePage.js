const homePage = document.querySelector('.homePage')
const links = document.querySelectorAll('#buttonLevelContainer .levelButtonGame')
const sound = document.querySelector('.sound')
let pseudo
let level
localStorage.setItem('sound', "false")
sound.children[0].src = localStorage.getItem("sound") === "true" ? "./images/volume-on.svg" : "./images/volume-off.svg"
$(document).ready (function (){
    let textCpt = 0
    //A éventuellement remplir par appel AJAX...
    let tabText = ["Appuyez sur les lettres qui tombent avant qu’elles touchent le bas ! ","Apprenez les touches de votre clavier en jouant !","Meilleur jeu pédagogique pour apprendre votre clavier !","Place tes index sur F et J, et tes autres doigts de façon confortable"]
    textFunction ()
    function textFunction ()
    {
        $("#rules").html(tabText[textCpt])
            textCpt = (textCpt + 1) % tabText.length
        setTimeout (textFunction,4500)
    }
});
//Lien avec game.html et transfert de donnée d'une page à l'autre
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function(){
    if (i==0) {
      //debutant
      //On enregistre 1 et pseudo dans localStorage
      recNameAndLevel(1)
    }else if (i==1) {
      //intermediaire
      //On enregistre 3 et pseudo dans localStorage
      recNameAndLevel(3)
    }else {
      //expert
      //On enregistre 5 et pseudo dans le localStorage
      recNameAndLevel(5)
    }
    //Go a game.html
    window.location='game.html'
  })
}
//On enregistre pseudo et level
function recNameAndLevel(level){
  let tempTab = []
  pseudo = document.querySelector('.textLabelInput').value
  tempTab.push(pseudo)
  tempTab.push(level)
  tempTab = JSON.stringify(tempTab)
  localStorage.setItem('nameAndLevel',tempTab)
}
sound.addEventListener('click', () => {
 let soundVal = localStorage.getItem('sound') === "true" ? "false" : "true"
 localStorage.setItem('sound', soundVal)
 if (soundVal === "true") {
  sound.children[0].src = "./images/volume-on.svg"
  homePage.play()
 } else {
  console.log(soundVal)
  sound.children[0].src = "./images/volume-off.svg"
  homePage.pause()
 }
})
