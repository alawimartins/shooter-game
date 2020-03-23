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


const popupGameOver = new Popup("Game over!", "restart", nextLevel2);
stage.addChild(popupGameOver.scene);

console.log('popupGameOver', popupGameOver)

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

//if the players succeed, the WonScene would be added on the top of the 
//game with an option do go to the next level. The visibility is primarely set as false and would only turn true if condition is met

//1st step is to create a container where all the elements will be added to it.
const wonScene = new PIXI.Container();
stage.addChild(wonScene);
wonScene.visible = false;

//2nd step is to do the background of the message, which in this case is a rectangle
//const restartBackground = new PIXI.Graphics();
//restartBackground.beginFill(0xff0000); //adding color to the rectangle
//restartBackground.drawRect(-200, -200, 400, 400); //setting the anchor and mesures
//3rd step is to add the restartBackground to the container WonScene. 
//Note: there is no need to add this to the stage as the whole container is already added to the stage.
//wonScene.addChild(restartBackground);

//4th add a message at the top of the pop-up and add it to to the Pixi.graphics created above (restartBackground)
const wonMessage = new PIXI.Text("You Won!");
//wonMessage.y = -restartBackground.height/2 + 20;
wonMessage.anchor.x = 0.5
wonMessage.anchor.y = 0
//restartBackground.addChild(wonMessage);


//5th step to add the click button to go to next level 
//for this you will need to create a rectangle with a text inside by using Pixi.Graphics 
//and Pixi text and adding this to the restart background
const nextLevelButton = new PIXI.Graphics();
nextLevelButton.beginFill(0x000000); 
nextLevelButton.drawRect(-50, -25, 100, 50);

//6th step: add the button to the restart background 
//restartBackground.addChild(nextLevelButton);

let nextLevelButtonStyle = new PIXI.TextStyle({
    fontFamily: "Futura",
    fontSize: 20,
    fill: "white"
});
//7th add the message button in the button const 
const nextLevelText = new PIXI.Text("nextLevel", nextLevelButtonStyle);
nextLevelText.anchor.x = .5
nextLevelText.anchor.y = .5
nextLevelButton.addChild(nextLevelText)

//8th now we need to make the button interact.
nextLevelButton.interactive =true;
nextLevelButton.buttonMode = true;

//9th create a function with all the elements needed once we click on the button
function nextLevel2() {
    popupGameOver.hide()

    // clean the scene

     currentLevel++;

     if (currentLevel === 1) {
        stage.addChild(bonusBullets)
     }
     resetGame();

     startLevel();
     
}

//10th add the event on pointerdown.

nextLevelButton.on('pointerdown', nextLevel2);


const repeatScene = new PIXI.Container();
stage.addChild(repeatScene);
repeatScene.visible = false;


//const repeatLevelBackground = new PIXI.Graphics();
//repeatLevelBackground.beginFill(0xff0000); //adding color to the rectangle
//repeatLevelBackground.drawRect(-200, -200, 400, 400); //setting the anchor and mesures

//repeatScene.addChild(repeatLevelBackground);

const repeatLevelMessage = new PIXI.Text("You lost, but you can still restart on the same level!");
//repeatLevelMessage.y = -repeatLevelBackground.height/2 + 20;
repeatLevelMessage.anchor.x = 0.5
repeatLevelMessage.anchor.y = 0
//repeatLevelBackground.addChild(repeatLevelMessage);


const repeatLevelButton = new PIXI.Graphics();
repeatLevelButton.beginFill(0x000000); 
repeatLevelButton.drawRect(-50, -25, 100, 50);

//repeatLevelBackground.addChild(repeatLevelButton);

let repeatLevelButtonStyle = new PIXI.TextStyle({
    fontFamily: "Futura",
    fontSize: 20,
    fill: "white"
});

const repeatLevelText = new PIXI.Text("Repeat Level", repeatLevelButtonStyle);
repeatLevelText.anchor.x = .5
repeatLevelText.anchor.y = .5
repeatLevelButton.addChild(repeatLevelText)

repeatLevelButton.interactive =true;
repeatLevelButton.buttonMode = true;



function repeatCurrentLevel () {
    repeatScene.visible = false;

    resetGame();

    startLevel();
}


//10th add the event on pointerdown.
repeatLevelButton.on('pointerdown', repeatCurrentLevel);

//The gameOver pop-up will be the same idea as the WonScene
// const gameOverScene = new PIXI.Container();
// stage.addChild(gameOverScene);
// gameOverScene.visible = false;

// const gameOverBackground = new PIXI.Graphics();
// gameOverBackground.beginFill(0x000000);
// gameOverBackground.drawRect(-200, -200, 400, 400);


// gameOverScene.addChild(gameOverBackground);

// let style = new PIXI.TextStyle({
//     fontFamily: "Futura",
//     fontSize: 64,
//     fill: "white"
// });

// const gameOverText = new PIXI.Text("Game Over", style);
// gameOverText.anchor.x = 0.5
// gameOverText.anchor.y = 1
// gameOverBackground.addChild(gameOverText);

const restartButton = new PIXI.Graphics();
restartButton.beginFill(0xff0000);
restartButton.drawRect(-50, -25, 100, 50);

//gameOverBackground.addChild(restartButton)

let restartButtonStyle = new PIXI.TextStyle({
    fontFamily: "Futura",
    fontSize: 20,
    fill: "white"
});

const restartText = new PIXI.Text("restart", restartButtonStyle);
restartText.anchor.x = .5
restartText.anchor.y = .5
restartButton.addChild(restartText)

restartButton.interactive = true;

// Shows hand cursor
restartButton.buttonMode = true;

function refreshPage(){
    // reset variables, clean scene etc.
    currentLevel = 0;
    
    gameOverScene.visible = false;
    
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


// Pointers normalize touch and mouse
restartButton.on('pointerdown', refreshPage)





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
rect = new PIXI.Graphics();
rect.beginFill(0xff0000);
rect.drawRect(-20, -20, 40, 40);
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
                    wonScene.visible = true;
                    
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
        gameOverScene.visible = true; //this will make the player go back to level 0
        paused = true;
        }
    }

    if (lifeScore>0) {
        if (bulletsArray.length + bulletsLeft < targetsArray.length) {

            lifeScore= lifeScore -1
            repeatScene.visible = true;
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
    // gameOverBackground.y = app.renderer.height/2; 

    // gameOverBackground.x = app.renderer.width/2

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