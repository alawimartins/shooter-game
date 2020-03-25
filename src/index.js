 import * as PIXI from 'pixi.js'
 
 import Popup from "./Popup" // the name Popup was just a chosen one. This is not the actual class
 
 //implementing the PIXI application and appending it to the body
 const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb, resolution: 1, autoResize: true,
});

document.body.appendChild(app.view);

//adding app to stage as constant

const stage = app.stage;

//Define any variables that are used in more than one function
let velocity = {
    x: 0,
    y: 0,
}
let rect;
let targetsArray = []
let bulletsArray =[];
let bulletsLeft;
let bulletsEmpty = false;
let score= 0;
let lifeScore = 3;
let currentLevel = 0;
let levels = [{
    bullets: 6,
    enemys: 1,
}, {
    bullets: 3,
    enemys: 1
}, {
    bullets: 1,
    enemys: 1
}, {
    bullets: 1,
    enemys: 1
}]


const popupGameOver = new Popup("Game over!", "restart", refreshPage);
stage.addChild(popupGameOver.scene);

const popupNextLevel = new Popup("Ready for Next Level?", "start", nextLevel2)
stage.addChild(popupNextLevel.scene)

const popupRepeatLevel = new Popup ("You lost, but you can still restart on the same level!", "repeat", repeatCurrentLevel)
stage.addChild(popupRepeatLevel.scene)

popupGameOver.hide()
popupNextLevel.hide()
popupRepeatLevel.hide()

//adding scored points to the stage
const basicText = new PIXI.Text(`Points Scored: ${score}`);
basicText.anchor.x = 1;
stage.addChild(basicText)

const bulletsText = new PIXI.Text(`Bullets Left: ${bulletsLeft}`);
bulletsText.anchor.x = .5;
stage.addChild(bulletsText)

const levelText = new PIXI.Text(`Level: ${currentLevel + 1}`);
stage.addChild(levelText)

//adding hearts to the stage
const lifeText = new PIXI.Text(`Number of Hearts: ${lifeScore}`);
stage.addChild(lifeText)


function nextLevel2() {
    popupNextLevel.hide()

    // clean the scene

     currentLevel++;

     if (currentLevel === 1) {
        stage.addChild(bonusBullets)
     }
     resetGame();

     startLevel();
     
}


function repeatCurrentLevel () {
    popupRepeatLevel.hide()

    resetGame();

    startLevel();
}

function refreshPage(){
    popupGameOver.hide()
    // reset variables, clean scene etc.
    currentLevel = 0;
    
    
    
    score= 0;
    lifeScore = 4;
    
    resetGame();
    

    startLevel();
}

function resetGame(){
    rect.y = app.screen.height - 150; 
    rect.x = app.screen.width/2
    bulletsEmpty = false
    paused = false;
    basicText.text = `Points Scored: ${score}`
    lifeText.text = `Number of Hearts: ${lifeScore}`
    for (let i = 0; i < targetsArray.length; i++) {
        stage.removeChild(targetsArray[i])
    }
    for (let i = 0; i < bulletsArray.length; i++) {
        stage.removeChild(bulletsArray[i])
    }

    targetsArray.length = 0
    bulletsArray.length = 0
}



// enemys function
function createEnemys(enemys) {
    for(let i=0; i<enemys; i++){
        const circle = new PIXI.Graphics()
        circle.beginFill(0xffff00);
        circle.drawCircle(0, 0, 15);
        circle.x = Math.random() * app.screen.width;
        circle.y = Math.random() * 200 + 10;

        targetsArray.push(circle)

        stage.addChild(circle)
    }
}

const bonusBullets = new PIXI.Graphics()
bonusBullets.beginFill(0xff0000);
bonusBullets.drawCircle(0, 0, 15);
bonusBullets.x = Math.random() * app.screen.width;
bonusBullets.y = Math.random() * 200 + 10;

//starting with 2 enemys

function startLevel() {
    // set the number of bullets
    const levelData = levels[currentLevel];
    createEnemys(levelData.enemys)
    bulletsLeft = levelData.bullets;
    bulletsText.text = `Bullets Left: ${bulletsLeft}`
    levelText.text = `Level: ${currentLevel + 1}`
}

startLevel();



//drawing the ship
function setup() {

//Create the `rect` sprite 
rect = PIXI.Sprite.from("https://media-exp1.licdn.com/dms/image/C5603AQG-5GLL7x0v1Q/profile-displayphoto-shrink_200_200/0?e=1585785600&v=beta&t=VjsZ7MFaQgpGv8RNCaKXIZ9eksGGQlo-eA5vmv2_ZWw");
//rect.beginFill(0xff0000);
//rect.drawRect(-20, -20, 40, 40);
rect.y = app.screen.height - 150; 
rect.x = app.screen.width/2
stage.addChild(rect);

//Start the game loop 
app.ticker.add(delta => gameLoop(delta));
}  

/**
 * EVENTS (Fire, move rect)
 */

document.body.onkeydown = onKeyDown;
document.body.onkeyup = onKeyUp;

const arrayMovements = [37, 38, 39, 40];

function onKeyUp (e) {
    // if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
    if (arrayMovements.indexOf(e.keyCode) > -1) {
        velocity.x = 0;
    }
}

function onKeyDown (e) {
    if (e.keyCode == 32){ // space bar, fire
        fire();
    }
    
    if (e.keyCode === 37) { // left
        velocity.x = -10;
        velocity.y = 0;
    }  else if (e.keyCode === 39) { // right
        velocity.x = 10;
        velocity.y = 0;
    } 
}

window.addEventListener('resize', onResize)

function fire (){    
    if (bulletsEmpty) {
        
        return;
    }

    const bullet = new PIXI.Graphics();
    bullet.beginFill('0xffc0cb');
    bullet.drawCircle(0, 0, 20);
    bullet.x = rect.x; 
    bullet.y = rect.y;
    bulletsLeft = bulletsLeft - 1
    bulletsText.text = `Bullets Left: ${bulletsLeft}`
    bulletsArray.push(bullet)

    
    stage.addChild(bullet);

    if (bulletsLeft < 1) {
        bulletsEmpty = true;
        console.log('no more bullets')
    }
}


let paused = false;

function gameLoop() {
    
    if (paused) return 
    
    //Use the rect's velocity to make it move
    rect.x += velocity.x;
    //rect.y += velocity.y; the y axis will be fixed

    if(rect.x >= app.screen.width-30){
        rect.x = app.screen.width - 30
    } else if (rect.x <= 30) {
        rect.x = 30;
    }


    // here move the bullets
    // here increment the positions
    for (let i = 0; i < bulletsArray.length; i++) {
        bulletsArray[i].position.y -= 3
        if (bulletsArray[i].position.y < 0) {
            stage.removeChild(bulletsArray[i])
            bulletsArray.splice(i,1)
            //decrement the i as the array is getting smaller
            i--
        }
    }

    // here move the enemies
    // here increment the positions
    for (let i = 0; i < targetsArray.length; i++) {
        const circle = targetsArray[i];
        circle.x += .9; 
    
        if (circle.x >= app.screen.width) {
            circle.x =-Math.random() * 100;
        }
    }
    

    // here we will check for collisions
    for(let j=0; j<bulletsArray.length; j++) {

        for (let i = 0; i < targetsArray.length; i++) {
            let bullet = bulletsArray[j];

            let circle = targetsArray[i];
            var dx = bullet.x - circle.x;
            var dy = bullet.y - circle.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullet.width/2 + circle.width/2) {
                stage.removeChild(circle)
                stage.removeChild(bullet)
                bulletsArray.splice(j,1)
                
                targetsArray.splice(i,1)
                i--
                j--
                
                score = score + 10
                basicText.text = `Points Scored: ${score}`
                
                if (targetsArray.length === 0) {
                    popupNextLevel.show();
                    
                }
                break;
            }
        }    
    }

    bonusBullets.x += .9; 
    if (bonusBullets.x >= app.screen.width) {
        bonusBullets.x =-Math.random() * 100;
    }

    //collision between the bonusBullets and bulletArray

        for(let j=0; j<bulletsArray.length; j++) {
            let bullet = bulletsArray[j]
            var dx = bullet.x - bonusBullets.x;
            var dy = bullet.y - bonusBullets.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullet.width/2 + bonusBullets.width/2) {
                stage.removeChild(bonusBullets)
                stage.removeChild(bullet)
                bulletsArray.splice(j,1)
                j--
                bulletsLeft = bulletsLeft + 3
                bulletsText.text = `Bullets Left: ${bulletsLeft}`
            }
        
        }  
    
        
    



    if (lifeScore<=0) {
        if (bulletsArray.length + bulletsLeft < targetsArray.length) {
        lifeScore= lifeScore -1
        popupGameOver.show() //this will make the player go back to level 0
        paused = true;
        }
    }

    if (lifeScore>0) {
        if (bulletsArray.length + bulletsLeft < targetsArray.length) {

            lifeScore= lifeScore -1
            popupRepeatLevel.show()
            paused = true;//display a gameOverscene but to go back to the same level
        }
    }
    

}

function onResize () {
    app.renderer.resize(window.innerWidth, window.innerHeight)

    basicText.x = window.innerWidth - 20;
    bulletsText.x = window.innerWidth/2
    levelText.y = window.innerHeight -40
    levelText.x =  20
    //app.renderer will get the full size of the canvas
    
    popupNextLevel.x = app.renderer.width/2
    popupNextLevel.y = app.renderer.height/2;
    popupRepeatLevel.x = app.renderer.width/2
    popupRepeatLevel.y = app.renderer.height/2;
    // restartBackground.x = app.renderer.width/2
    // restartBackground.y = app.renderer.height/2; 

    // repeatLevelBackground.x=app.renderer.width/2
    // repeatLevelBackground.y=app.renderer.height/2;

    popupGameOver.x = app.renderer.width/2;
    popupGameOver.y = app.renderer.height/2;

    // popupGameOver.setPosition(app.renderer.width/2,app.renderer.height/2)
}

setup();
onResize();