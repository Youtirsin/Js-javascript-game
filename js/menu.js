let gotcha=document.querySelector(".btn");
let textarea=document.querySelector("#span");
let texts=['Press W,A,S,D to control.','Try to eat your buddies.','Or ull starve.',"Keep moving,dude."];
let textIndex=1;
let sound=new Audio("src/button.mp3");
window.addEventListener("load",main);

function main(){
    textarea.innerHTML=texts[0];
    gotcha.addEventListener('click',()=>{
        sound.currentTime=0;
        sound.play();
        if(textIndex>=texts.length){
            window.location.href='game.html';
        }else{
            textarea.innerHTML=texts[textIndex++];
        }
    });
};


