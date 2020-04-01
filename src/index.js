 import * as PIXI from 'pixi.js'
 import sky from "./images/sky.png"
 import spaceship from "./images/spaceship.png"
 import heart from "./images/heart.png"
 import bulletfire from "./images/bullet.png"
 import Popup from "./Popup" // the name Popup was just a chosen one. This is not the actual class
 import Pannel from "./Pannel"
 import Marker from "./Marker"
 import Enemy from "./Enemy"
 import EnemySpeed from "./EnemySpeed"
 import EnemySpeedCircle from "./EnemySpeedCircle"
 import EnemyColorAlpha from "./EnemyColorAlpha"
 import EnemyFlyingCircle from "./EnemyFlyingCircle"
 import enemyImage from"./images/enemy.png"
 import {PixelateFilter} from '@pixi/filter-pixelate';
 import displacementImage from "./images/displacement_map_repeat.jpg"
 import heartOnText from "./images/heartfortext.png"
 import bulletOnText from "./images/bulletfortext.png"
 import enemyOnText from "./images/enemyfortext.png"
 import startButton from "./images/start.png"
 import restartButton from "./images/restart.png"
 import sign from "./images/sign.png"
 import keyLeftRight from "./images/keyboard.png"
 import spaceBar from "./images/spacebar.png"
 import instruction from "./images/instruction.png"
 import fireButton from "./images/fireButton.png"
 import instspace from "./images/bulletandenemy.png"
 import help from "./images/help.png"
 import enemys2 from "./images/enemy2.png"
 import enemys3 from "./images/enemy3.png"
 import enemys4 from "./images/mosquito.png"
 import music from "./audio/takeonme.mp3"
 import music2 from "./audio/weekend.mp3"
 import imageAudio from "./images/audio.png"
 import {Howl, Howler} from 'howler';


 

 
 //implementing the PIXI application and appending it to the body
 const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb, resolution: 1, autoResize: true,
});

window.WebFontConfig = {
    google: {
        families: ['Press Start 2P'],
    },

    active() {
        webFontLoaded();
    },
};

// include the web-font loader script
(function() {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'
    }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = 'true';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}());

function webFontLoaded () {
    app.loader.add([instruction, sky,spaceship,heart,bulletfire,enemyImage, displacementImage, heartOnText,bulletOnText, enemyOnText ,startButton,restartButton,sign,spaceBar,keyLeftRight ,help,instspace, enemys2,enemys3,enemys4,imageAudio,music2]);
    app.loader.load(initGame)

    function initGame(loader, resources) {
        console.log(resources);
        

        const backgroundSky = PIXI.Sprite.from(sky);
        console.log('backgroundSky', backgroundSky.width)
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
        console.log('displacementSprite', displacementSprite.width)
        // Make sure the sprite is wrapping.
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
        displacementFilter.padding = 10;

        displacementSprite.position = maskedContainer.position;

        app.stage.addChild(displacementSprite);

        maskedContainer.filters = [displacementFilter];

        displacementFilter.scale.x = 60;
        displacementFilter.scale.y = 120;


        const filter = new PixelateFilter()
        filter.size = 3;
        pixelImages.filters = [filter]
        let gameSizeX =500
        let gameSizeY = 600

        //adding border to the game
        const border = new PIXI.Graphics()
        maskedContainer.addChild(border)

        maskedContainer.mask = border;

        //Define any variables that are used in more than one function
        let velocity = {
            x: 0,
            y: 0,
        }
        let isMobile = PIXI.utils.isMobile.any;
        let rect;
        let targetsArray = []
        let bulletsArray =[];
        let bulletsLeft;
        let bulletsEmpty = false;
        let score= 0;
        let lifeScore = 3;
        let audio=true;
        let fingerX = 0;
        let fingerY = 0;

        let currentLevel = 0;
        let minValueY= screenSizeY - gameSizeY/2 + 15
        let maxValueY= 130
        let levels = [{
            bullets: 6,
            enemys: [
                { type: Enemy, number: 2 },
            ],
        }, {
            bullets: 8,
            enemys: [
                { type: Enemy, number: 4 },
                { type :EnemyFlyingCircle, number: 1 }
            ],
        }, {
            bullets: 8,
            enemys: [
                { type: Enemy, number: 5 },
                { type: EnemySpeed, number: 2 },
             ],
        }, {
            bullets: 8,
            enemys: [
                { type: Enemy, number: 4 },
                { type: EnemySpeed, number: 1 },
                { type: EnemyColorAlpha, number: 2 }
            ],
        },{
            bullets: 14,
            enemys: [
                { type: Enemy, number: 4 },
                { type: EnemySpeed, number: 3 },
                { type: EnemyColorAlpha, number: 3 },
                { type :EnemyFlyingCircle, number: 2 }
            ],
        }, {
            bullets: 9,
            enemys: [
                { type: Enemy, number: 2 },
                { type: EnemySpeed, number: 1 },
                { type: EnemyColorAlpha, number: 2 },
                { type: EnemySpeedCircle, number: 3 }
            ],
        }, {
            bullets: 11,
            enemys: [
                { type: Enemy, number: 2 },
                { type: EnemySpeed, number: 2 },
                { type: EnemyColorAlpha, number: 3 },
                { type: EnemySpeedCircle, number: 2 }
            ],
        },{
            bullets: 11,
            enemys: [
                { type: Enemy, number: 2 },
                { type: EnemySpeed, number: 2 },
                { type: EnemyColorAlpha, number: 3 },
                { type: EnemySpeedCircle, number: 2 },
                { type :EnemyFlyingCircle, number: 2 }
            ],
        }
    ]


        const  markerLife = new Marker(lifeScore, heartOnText)
        stage.addChild(markerLife.textSceneWithImage);

        
        const markerBullet = new Marker (bulletsLeft, bulletOnText)
        stage.addChild(markerBullet.textSceneWithImage);

        const markerEnemy = new Marker (bulletsLeft, enemyOnText)
        stage.addChild(markerEnemy.textSceneWithImage);

        

        const pannelMove = new Pannel (hideTheInstruction) 
        stage.addChild(pannelMove.scene)

        var sound = new Howl({
            src: [music],
            onend: function() {
               sound = new Howl ({
                    src: [music2],
                })
                sound.play()
            }
        })
        sound.play()
          
          

        const helpButton = new PIXI.Sprite.from(help)
        stage.addChild(helpButton)
        helpButton.interactive =true;
        helpButton.buttonMode = true;
        helpButton.on('pointerdown', function(){
            pannelMove.show();
        });

        const audioImage = new PIXI.Sprite.from(imageAudio)
        stage.addChild(audioImage)
        audioImage.interactive =true;
        audioImage.buttonMode = true;
        audioImage.on('pointerdown', function(){
            audio = !audio
            if(audio){
                sound.play();
            } else {
                sound.pause();
            }
        });

        
        

        const popupGameOver = new Popup("Game over!", refreshPage, restartButton, sign);
        stage.addChild(popupGameOver.scene);

        const popupNextLevel = new Popup("Ready for Next Level?", nextLevel2, startButton,sign)
        stage.addChild(popupNextLevel.scene)

        const popupRepeatLevel = new Popup ("You lost, but you can still restart on the same level!", repeatCurrentLevel, startButton, sign)
        stage.addChild(popupRepeatLevel.scene)

        const popupGameFinished = new Popup ("You Won! Do you want to Restart?",refreshPage,restartButton, sign)
        stage.addChild(popupGameFinished.scene)

        popupGameOver.hide()
        popupNextLevel.hide()
        popupRepeatLevel.hide()
        popupGameFinished.hide()
        pannelMove.show()
        

        //adding scored points to the stage
       

        const levelText = new PIXI.Text(`Level: ${currentLevel + 1}`, {fontFamily: 'Press Start 2P', fontSize: 20, fill: 'black'});
        stage.addChild(levelText)

       

        let bonusBullets;

        function hideTheInstruction() {
            pannelMove.hide()
        }

        function nextLevel2() {
            popupNextLevel.hide()

            // clean the scene

            currentLevel++;

            if (currentLevel === 1 || currentLevel ===3) {
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
            popupGameFinished.hide()
            // reset variables, clean scene etc.
            currentLevel = 0;
            
            
            
            score= 0;
            lifeScore = 4;
            
            resetGame();
            

            startLevel();
        }

        function resetGame(){
            rect.y = fingerY = screenSizeY * (isMobile ? 1.7 : 1.4)
            rect.x = fingerX= screenSizeX/2
            bulletsEmpty = false
            paused = false;
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

            for(let i=0; i< enemys.length; i++) { // loop through the different type of enemies
                const classEnemy = enemys[i].type; // enemy type
                const numberEnemiesToCreate = enemys[i].number; // number: number of enemies

                for (let k = 0; k < numberEnemiesToCreate; k++) {
                    // here create the enemies
                    let enemy = new classEnemy();
                    if (enemy.type === "circle") {
                        enemy.x= screenSizeX
                    } else {
                        enemy.x = Math.random()*screenSizeX -200 + (screenSizeX -200) 
                    }
                    
                    enemy.y = minValueY + enemy.height + Math.random()*(maxValueY-minValueY) 
                    targetsArray.push(enemy)
    
                    pixelImages.addChild(enemy)
                }
            }
        }




        //starting with 2 enemys

        function startLevel() {
            // set the number of bullets
            const levelData = levels[currentLevel];
            createEnemys(levelData.enemys)
            markerEnemy.updateScore(targetsArray.length)
            bulletsLeft = levelData.bullets;
            markerBullet.updateScore(bulletsLeft);
            levelText.text = `Level: ${currentLevel + 1}`
            
            
        }
       

        startLevel();



        //drawing the ship
        function setup() {

        //Create the `rect` sprite 
        rect = PIXI.Sprite.from(spaceship)
        rect.scale.set(.18)
        rect.y = fingerY= screenSizeY * (isMobile ? 1.7 : 1.4); 
        rect.x =fingerX =screenSizeX;
        pixelImages.addChild(rect);
        rect.anchor.set(0.5, isMobile ? 1 : 0)   
        rect.hitArea = new PIXI.Rectangle(-100/2, -100/2, 100, 200);

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


        console.log('PIXI.utils', PIXI.utils);
        
        if(isMobile) {

            gameSizeX =app.screen.width
            gameSizeY= app.screen.height
            const button = new PIXI.Sprite.from(fireButton)
            let shipCanMove = true;
            button.x = screenSizeX 
            button.y = screenSizeY + gameSizeY/2.5
            button.anchor.set(0.5);
            stage.addChildAt(button, 2)
            button.interactive =true;
            button.buttonMode = true;
            button.hitArea = new PIXI.Rectangle(-100/2, -100/2, 100, 100);
            button.on('pointerdown', function(){
                shipCanMove = false
                 fire();
            })
            maskedContainer.on('pointerup', function(){
                shipCanMove = true
            })

            maskedContainer.interactive = true;
            
            maskedContainer.on("touchstart", function (event){
                if (!shipCanMove) return;
                
                const newPosition = event.data.getLocalPosition(stage);
                fingerX = newPosition.x;
                // fingerY = newPosition.y;  
                
                // if (fingerY < gameSizeY/1.6) {
                //     fingerY =gameSizeY/1.6
                // }
            })

            maskedContainer.on("touchmove", function (event){
                if (!shipCanMove) return;

                const newPosition = event.data.getLocalPosition(stage);
                fingerX = newPosition.x;
                // fingerY = newPosition.y;   

                // if (fingerY < gameSizeY/1.6) {
                //     fingerY =gameSizeY/1.6
                // }

                 
                
            })
            pannelMove.reSize()
            popupGameOver.reSize()
            popupNextLevel.reSize()
            popupRepeatLevel.reSize()
            popupGameFinished.reSize()      
            



        }

        window.addEventListener('resize', onResize)

        function fire (){    
            if (bulletsEmpty) {
                
                return;
            }

            const bullet = PIXI.Sprite.from(bulletfire)
            bullet.anchor.x=.5
            bullet.anchor.y =1
            bullet.x = rect.x; 
            bullet.y = rect.y + (isMobile ? -rect.height : 0);

            console.log(rect.y, isMobile ? -rect.height : 0)
            bulletsLeft = bulletsLeft - 1
            markerBullet.updateScore(bulletsLeft)
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

            if (isMobile) {
                const ease = 0.05;

                let distX = (fingerX - rect.x) * ease;
                rect.x = rect.x + distX;

                let distY = (fingerY - rect.y) * ease;
                rect.y = rect.y + distY;
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
                const enemy = targetsArray[i];
                enemy.x += enemy.speed; 
                // enemy.y -= enemy.speedY
            
                enemy.y += Math.cos(enemy.tick / 12) * enemy.amplitude;
                
                enemy.update();

                if (enemy.x >= screenSizeX+gameSizeX/1.9) {
                    enemy.x = screenSizeX-gameSizeX/1.9;
                }
            }
            

            // here we will check for collisions
            for(let j=0; j<bulletsArray.length; j++) {

                for (let i = 0; i < targetsArray.length; i++) {
                    let bullet = bulletsArray[j];

                    let circle = targetsArray[i];
                    var dx = bullet.x - (circle.x + circle.sprite.x);
                    var dy = bullet.y - (circle.y + circle.sprite.y);
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < bullet.width/2 + circle.sprite.width/2) {
                        pixelImages.removeChild(circle)
                        pixelImages.removeChild(bullet)
                        console.log("bullet1",bullet)
                        bulletsArray.splice(j,1)
                        
                        targetsArray.splice(i,1)
                        markerEnemy.updateScore(targetsArray.length)

                        i--
                        j--
                        
                    
                        if (targetsArray.length === 0) {
                            if (currentLevel >= levels.length -1 ) {
                                popupGameFinished.show()
                            } 
                            else {
                                popupNextLevel.show();
                            }
                        } 
                        
                        break;
                    }
                }    
            }

            if (bonusBullets) {

                bonusBullets.x += .9;
                bonusBullets.y += Math.cos(bonusBullets.tick / 12) * 5;
                
                bonusBullets.tick++; 

                if (bonusBullets.x >= screenSizeX+gameSizeX/1.78) {
                    bonusBullets.x = screenSizeX-gameSizeX/1.78;
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
                        markerBullet.updateScore(bulletsLeft)
                        bonusBullets = undefined;
                        break;
                    }
                
                }  
            }
            
            //collision between the bonusBullets and bulletArray
            
            
                
            



            if (lifeScore<=0) {
                if (bulletsArray.length + bulletsLeft < targetsArray.length) {
                lifeScore= lifeScore -1 
                // console.log(lifeScore,"lifeScore")
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

            // Offset the sprite position to make vFilterCoord update to larger value. Repeat wrapping makes sure there's still pixels on the coordinates.
            displacementSprite.y++;
            // Reset x to 0 when it's over width to keep values from going to very huge numbers.
            if (displacementSprite.x > displacementSprite.width) { displacementSprite.x = 0; }
            

        }

        function onResize () {
            app.renderer.resize(window.innerWidth, window.innerHeight)
            screenSizeX = app.screen.width/2
            screenSizeY = app.screen.height/2

            border.clear();
            border.beginFill(0xFF0000);
            const wMask = gameSizeX;
            const hMask = gameSizeY;
            border.drawRect(screenSizeX-wMask/2, screenSizeY- hMask/2, wMask, hMask);
            border.endFill();

            levelText.y = screenSizeY + gameSizeY/2.2
            levelText.x = screenSizeX - gameSizeX/3
            //app.renderer will get the full size of the canvas
            
            popupNextLevel.x = app.renderer.width/2
            popupNextLevel.y = app.renderer.height;
            popupRepeatLevel.x = app.renderer.width/2
            popupRepeatLevel.y = app.renderer.height;
            // restartBackground.x = app.renderer.width/2
            // restartBackground.y = app.renderer.height/2; 

            // repeatLevelBackground.x=app.renderer.width/2
            // repeatLevelBackground.y=app.renderer.height/2;

            popupGameOver.x = app.renderer.width/2;
            popupGameOver.y = popupRepeatLevel.y;

            pannelMove.x = app.renderer.width/2;
            pannelMove.y= app.renderer.height/2;

            popupGameFinished.x = app.renderer.width/2;
            popupGameFinished.y = popupRepeatLevel.y;
            
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

            markerLife.textSceneWithImage.y = screenSizeY - gameSizeY/2 + 15
            markerLife.textSceneWithImage.x = screenSizeX - gameSizeX/3

            markerBullet.textSceneWithImage.y = markerLife.textSceneWithImage.y
            markerBullet.textSceneWithImage.x = markerLife.textSceneWithImage.x + 90//screenSizeX - gameSizeX/6

            markerEnemy.textSceneWithImage.y = markerLife.textSceneWithImage.y
            markerEnemy.textSceneWithImage.x = markerBullet.textSceneWithImage.x + 90; //screenSizeX - gameSizeX/20

            helpButton.y = markerLife.textSceneWithImage.y
            helpButton.x =screenSizeX  + gameSizeX/2 - helpButton.width - 10;

            audioImage.y = screenSizeY + gameSizeY/2 - audioImage.height 
            audioImage.x =screenSizeX  + gameSizeX/2 - helpButton.width - 10;
    
            
            // popupGameOver.setPosition(app.renderer.width/2,app.renderer.height/2)
        }

        setup();
        onResize();
    }
}


