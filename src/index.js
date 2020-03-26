 import * as PIXI from 'pixi.js'
 import sky from "./images/sky.png"
 import spaceship from "./images/spaceship.png"
 import heart from "./images/heart.png"
 import bulletfire from "./images/bullet.png"
 import Popup from "./Popup" // the name Popup was just a chosen one. This is not the actual class
 import Marker from "./Marker"
 import enemyImage from"./images/enemy.png"
 import {PixelateFilter} from '@pixi/filter-pixelate';
 import displacementImage from "./images/displacement_map_repeat.jpg"
 import heartOnText from "./images/heartfortext.png"
 
 //implementing the PIXI application and appending it to the body
 const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb, resolution: 1, autoResize: true,
});

const backgroundSky = PIXI.Sprite.from(sky);
backgroundSky.anchor.set(0.5);
document.body.appendChild(app.view);

let screenSizeX = app.screen.width/2
let screenSizeY = app.screen.height/2




//adding app to stage as constant

const stage = app.stage;
stage.addChild(backgroundSky)

const maskedContainer = new PIXI.Container();
stage.addChild(maskedContainer);

const backgroundSkyMask = PIXI.Sprite.from(sky)
backgroundSkyMask.anchor.set(0.5)
maskedContainer.addChild(backgroundSkyMask)

//transforming the images into pixelized ones
const pixelImages = new PIXI.Container()
maskedContainer.addChild(pixelImages) 
//pixelImages.addChild(heartOnText)

const displacementSprite = PIXI.Sprite.from(displacementImage);
// Make sure the sprite is wrapping.
displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
displacementFilter.padding = 10;

displacementSprite.position = maskedContainer.position;

app.stage.addChild(displacementSprite);

maskedContainer.filters = [displacementFilter];

displacementFilter.scale.x = 60;
displacementFilter.scale.y = 120;


app.ticker.add(() => {
    // Offset the sprite position to make vFilterCoord update to larger value. Repeat wrapping makes sure there's still pixels on the coordinates.
    displacementSprite.y++;
    // Reset x to 0 when it's over width to keep values from going to very huge numbers.
    if (displacementSprite.x > displacementSprite.width) { displacementSprite.x = 0; }
});


const filter = new PixelateFilter()
filter.size = 3;
pixelImages.filters = [filter]
const gameSizeX =500
const gameSizeY = 600

//adding border to the game
const border = new PIXI.Graphics()
border.beginFill(0xFEEB77,0.5);
border.drawRect(screenSizeX-250, screenSizeY-300, gameSizeX, gameSizeY);
border.endFill();

maskedContainer.addChild(border)

maskedContainer.mask = border;

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
let minValueY= screenSizeY - gameSizeY/2 + 25
let maxValueY= 200
let levels = [{
    bullets: 6,
    enemys: 1,
}, {
    bullets: 20,
    enemys: 15
}, {
    bullets: 1,
    enemys: 1
}, {
    bullets: 1,
    enemys: 1
}]


const   markerLife = new Marker(lifeScore, heartOnText)
stage.addChild(markerLife.textSceneWithImage);

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

let bonusBullets;

function nextLevel2() {
    popupNextLevel.hide()

    // clean the scene

     currentLevel++;

     if (currentLevel === 1) {
        bonusBullets = PIXI.Sprite.from(heart)
        bonusBullets.tick = 0;
        bonusBullets.scale.set(.05);
        bonusBullets.anchor.set(.5);
        bonusBullets.x = Math.random() * screenSizeX - 200;
        bonusBullets.y = minValueY + Math.random()*(maxValueY-minValueY)
        maskedContainer.addChild(bonusBullets)
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
    rect.y = screenSizeY+160;
    rect.x = screenSizeX/2
    bulletsEmpty = false
    paused = false;
    basicText.text = `Points Scored: ${score}`
    markerLife.updateScore(lifeScore);
    for (let i = 0; i < targetsArray.length; i++) {
        pixelImages.removeChild(targetsArray[i])
    }
    for (let i = 0; i < bulletsArray.length; i++) {
        pixelImages.removeChild(bulletsArray[i])
    }

    targetsArray.length = 0
    bulletsArray.length = 0
}



// enemys function
function createEnemys(enemys) {
    
    for(let i=0; i<enemys; i++){

        const circle = PIXI.Sprite.from(enemyImage)
        circle.scale.set(.04);
        circle.anchor.set(.5)
        
       
        circle.x = Math.random()*screenSizeX -200 + (screenSizeX -200);
        circle.y = minValueY + Math.random()*(maxValueY-minValueY)
        

        targetsArray.push(circle)

        pixelImages.addChild(circle)
    }
}




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
rect = PIXI.Sprite.from(spaceship)
rect.scale.set(.15)
rect.anchor.x = .5
rect.y = screenSizeY+160; 
rect.x = screenSizeX
pixelImages.addChild(rect);

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

    const bullet = PIXI.Sprite.from(bulletfire)
    bullet.scale.set(.08);
    bullet.anchor.x=.5
    bullet.anchor.y =1
    bullet.x = rect.x; 
    bullet.y = rect.y;
    bulletsLeft = bulletsLeft - 1
    bulletsText.text = `Bullets Left: ${bulletsLeft}`
    bulletsArray.push(bullet)

    
    pixelImages.addChild(bullet);

    if (bulletsLeft < 1) {
        bulletsEmpty = true;
    }
}


let paused = false;

function gameLoop() {
    
    if (paused) return 
    
    //Use the rect's velocity to make it move
    rect.x += velocity.x;
    //rect.y += velocity.y; the y axis will be fixed

    if(rect.x >= screenSizeX+200){
        rect.x = screenSizeX +200
    } else if (rect.x <= screenSizeX -200) {
        rect.x = screenSizeX -200;
    }


    // here move the bullets
    // here increment the positions
    for (let i = 0; i < bulletsArray.length; i++) {
        bulletsArray[i].position.y -= 3
        if (bulletsArray[i].position.y < 0) {
            pixelImages.removeChild(bulletsArray[i])
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
    
        if (circle.x >= screenSizeX+gameSizeX/1.94) {
            circle.x = screenSizeX-gameSizeX/1.94;
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
                pixelImages.removeChild(circle)
                pixelImages.removeChild(bullet)
                console.log("bullet1",bullet)
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

    if (bonusBullets) {

        bonusBullets.x += .9;
        bonusBullets.y += Math.cos(bonusBullets.tick / 12) * 5;
        
        bonusBullets.tick++; 
        if (bonusBullets.x >= screenSizeX+200) {
            bonusBullets.x =screenSizeX-200;
        }
        for(let j=0; j<bulletsArray.length; j++) {
            let bullet = bulletsArray[j]
            var dx = bullet.x - bonusBullets.x;
            var dy = bullet.y - bonusBullets.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullet.width/2 + bonusBullets.width/2) {
                maskedContainer.removeChild(bonusBullets)
                pixelImages.removeChild(bullet)
                bulletsArray.splice(j,1)
                j--
                bulletsEmpty = false;
                bulletsLeft = bulletsLeft + 3
                bulletsText.text = `Bullets Left: ${bulletsLeft}`
                bonusBullets = undefined;
            }
        
        }  
    }
    
    //collision between the bonusBullets and bulletArray
    
    
        
    



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
    popupNextLevel.y = app.renderer.height;
    popupRepeatLevel.x = app.renderer.width/2
    popupRepeatLevel.y = app.renderer.height/2;
    // restartBackground.x = app.renderer.width/2
    // restartBackground.y = app.renderer.height/2; 

    // repeatLevelBackground.x=app.renderer.width/2
    // repeatLevelBackground.y=app.renderer.height/2;

    popupGameOver.x = app.renderer.width/2;
    popupGameOver.y = app.renderer.height/2;


    
    backgroundSky.x = app.renderer.width/2;
    backgroundSky.y = app.renderer.height/2;

    backgroundSkyMask.x = app.renderer.width/2;
    backgroundSkyMask.y = app.renderer.height/2;

    // background image dimensions
    const wS = 1850;
    const hS = 910;


    const scaleW = app.renderer.width / wS;
    const scaleH = app.renderer.height / hS;

    const scale = Math.max(scaleW, scaleH);
    backgroundSky.scale.set(scale);
    backgroundSkyMask.scale.set(scale)

    markerLife.textSceneWithImage.y = screenSizeY - gameSizeY/2
    markerLife.textSceneWithImage.x = screenSizeX

    // popupGameOver.setPosition(app.renderer.width/2,app.renderer.height/2)
}

setup();
onResize();