let animations = ['sizing', 'shaking', 'rotating', 'rotatingSized', 'shakingSized'];
let words = ["Yummy!", "Delicious!", "Great!"];
let playground = new Playground();
function Playground() {
    this.entity = document.querySelector("#background");
    this.bgm=new Audio("src/bgm.mp3");
    this.size = {
        width: 700,
        height: 700
    };
    this.init = function () {
        this.bgm.play();
        this.bgm.addEventListener("ended", () => {
            this.bgm.play();
        });
    };
};

function Player(playground) {
    this.entity = document.createElement("img");
    this.HP = 20;
    this.sound = new Audio("src/sound.mp3");
    this.playground = playground;
    this.position = {
        x: 0,
        y: 0
    };
    this.size = {
        width: 80,
        height: 100
    };
    this.init = function () {
        this.entity.src="src/bobo.png";
        this.entity.className="player";
        this.playground.entity.appendChild(this.entity);
        this.deadvoice=new Audio('src/dead.mp3');
        this.update();
        setInterval(() => {
            this.HP >= -1? this.HP-- : null;
            if (this.HP < 10 && this.HP >0) {
                this.say("Oh god.Im starving");
                this.entity.className = "player shaking";
            } else if(this.HP>=10){
                this.entity.className = "player";
            }else if(this.HP==0){
                this.say("Bye,world");
                this.deadvoice.play();
                this.entity.className="dead";
                setTimeout(() => {
                    window.location.href="index.html"
                }, 5000);
            }
            console.log(this.HP);
        }, 1000);
    };
    this.update = function () {
        this.entity.style.left = this.position.x + 'px';
        this.entity.style.top = this.position.y + 'px';
    };
    this.checkNextIntheCircle = function (x, y) {
        //x in [0,circle.x-size.width];
        //y in [0,circle.y-size.height];
        return this.position.x + x >= 0 && this.position.x + x <= (this.playground.size.width - this.size.width) &&
            this.position.y + y >= 0 && this.position.y + y <= (this.playground.size.height - this.size.height);
    };
    this.move = function (x, y) {
        if (this.checkNextIntheCircle(x, y)) {
            this.position.x += x;
            this.position.y += y;
            this.update();
        }
    };
    this.collide = function (target) {
        //x<food.x<x+width
        //y<food.y<y+height
        return (target.position.x > this.position.x) &&
            (target.position.x < (this.position.x + this.size.width)) &&
            (target.position.y > this.position.y) &&
            (target.position.y < (this.position.y + this.size.height));
    };
    this.eat = function (target) {
        this.sound.currentTime = 0;
        this.sound.play();
        this.HP >= 20 ? null : this.HP++;
        target.destroy();
        this.say(words[getRandom(0, 3)]);
    };
    this.say = function (sentence) {
        let talk = document.createElement("div");
        talk.innerHTML = sentence;
        talk.className = "talk";
        talk.style.left = this.position.x + "px";
        talk.style.top = this.position.y - 25 + "px";
        this.playground.entity.appendChild(talk);
        setTimeout(() => {
            this.playground.entity.removeChild(talk);
        }, 500);
    }
};

function Food(playground) {
    this.entity = document.createElement("img");
    this.playground = playground;
    this.position = {
        x: 0,
        y: 0
    };
    this.size = {
        width: 16,
        height: 20
    };
    this.init = function (rangex, rangey) {
        this.entity.src = "src/bobo.png";
        this.entity.className = "food " + animations[getRandom(0, 4)];

        this.position.x = getRandom(1, rangex - this.size.width);
        this.position.y = getRandom(1, rangey - this.size.height);
        this.update();
        this.playground.entity.appendChild(this.entity);
    };
    this.update = function () {
        this.entity.style.left = this.position.x + 'px';
        this.entity.style.top = this.position.y + 'px';
    };
    this.destroy = function () {
        this.playground.entity.removeChild(this.entity);
    };
};

window.addEventListener('load',main);

function main() {
    document.querySelector("#start").onclick=function(){
        {
            let click_voice=new Audio("src/button.mp3");
            click_voice.currentTime=0;
            click_voice.play();
        }
        this.remove();
        playground.init();
        start();
    };
};
function start(){
    let player = new Player(playground);
    player.init();
    let foods = [];

    setInterval(() => {
        let food = new Food(playground, player);
        food.init(playground.size.width, playground.size.height);
        foods.push(food);
    }, 1000);

    window.addEventListener("keydown", (event) => {
        if (event.key == "d") {
            player.move(10, 0);
        }
        if (event.key == 'a') {
            player.move(-10, 0);
        }
        if (event.key == 'w') {
            player.move(0, -10);
        }
        if (event.key == 's') {
            player.move(0, 10);
        }
        for (let i = 0; i < foods.length; i++) {
            if (player.collide(foods[i])) {
                player.eat(foods[i]);
                foods.splice(i, 1);
            }
        }
    });
};


function getRandom(maxNum, minNum) {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}