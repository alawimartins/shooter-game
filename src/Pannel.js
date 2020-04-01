import * as PIXI from 'pixi.js'
import spaceBar from "./images/spacebar.png"
import close from "./images/exit.png"
import instspace from "./images/bulletandenemy.png"
import spaceshipleft from "./images/spaceshipleftright.png"
import next from "./images/next.png"
import instruction from "./images/instruction.png"

//

class Pannel {
    constructor(onButtonClicked) {
        this.onButtonClickedFinished = onButtonClicked;
        //container

        this.buttonclicked = false 
        this.scene = new PIXI.Container();
        
        //we will create a background
        this.background = new PIXI.Sprite.from(instruction)
        this.background.anchor.y = 0.5
        this.background.anchor.x = 0.5
        this.background.scale.set(2.6) 
        this.scene.addChild(this.background)

        this.keyboard = new PIXI.Sprite.from(spaceshipleft)
        this.keyboard.anchor.y = 0.5
        this.keyboard.anchor.x = 0.5
        this.keyboard.y= 50
        this.scene.addChild(this.keyboard)

        //button
        this.button = new PIXI.Sprite.from(next)
        
        // button.beginFill(0x000000); 
        // button.drawRect(-50, -25, 100, 50);
         this.button.interactive =true;
         this.button.buttonMode = true;
         this.button.y = 150
         this.button.x = 90
         this.button.anchor.set(.5)
         this.button.on('pointerdown', this.onButtonNext.bind(this));

        //6th step: add the button to the restart background 
        this.scene.addChild(this.button);


        //header text
        const header = new PIXI.Text("Instructions", {fontFamily: 'Press Start 2P', fontSize: 28, fill: 'black', wordWrap:true, wordWrapWidth:350, leading:20, align:"center"});
        header.y = -160;
        header.anchor.x = 0.5
        header.anchor.y = 0
        this.scene.addChild(header);


        this.message = new PIXI.Text("Move the spaceship left and right:", {fontFamily: 'Press Start 2P', fontSize: 18, fill: 'black', wordWrap:true, wordWrapWidth:400, leading:20});
        this.message.y = -100;
        this.message.anchor.x = 0.5
        this.message.anchor.y = 0
        this.scene.addChild(this.message);
        
        
    }

    onButtonNext () {
        if (this.buttonclicked) {
            this.onButtonClickedFinished()
         } else {
            this.message.text = "Fire to your enymies pressing:"
            this.keyboard.texture = PIXI.Texture.from(instspace)
            this.button.texture = PIXI.Texture.from(close)
            this.buttonclicked = true
         }

    }

    set x(x) {
        this.scene.x = x;
    }

    get x() {
        return this.scene.x
    }

    set y(y) {
        this.scene.y = y;
    }



    get y() {
        return this.scene.y
    }


    setPosition(x,y) {
        this.scene.x = x;
        this.scene.y = y;

    }

    hide() {
        this.scene.visible = false
        this.message.text = "Move the spaceship left and right:"
        this.keyboard.texture = PIXI.Texture.from(spaceshipleft)
        this.button.texture = PIXI.Texture.from(next)
        this.buttonclicked = false 
    }

    show() {
        this.scene.visible = true
    }

    reSize () {
        
        //get the width of the pannel
        this.background.width
        //get width of the window
        window.innerWidth
        //find the scale to fit the pannel in the windows bond
        this.scene.scale.set(window.innerWidth / this.scene.width)
    }
}

export default Pannel; 