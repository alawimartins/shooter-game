import * as PIXI from 'pixi.js'
import sign from "./images/sign.png"
import startButton from "./images/start.png"
class Popup {
    constructor(title, buttonMessage, onButtonClicked) {
        //container
        this.scene = new PIXI.Container();
        
        //we will create a background
        const background = new PIXI.Sprite.from(sign)
        background.anchor.y = 1
        background.anchor.x = 0.5
        background.scale.set(1.5)
        this.scene.addChild(background)
        
        //button
        const button = new PIXI.Sprite.from(startButton)
        button.scale.set(.6)
        // button.beginFill(0x000000); 
        // button.drawRect(-50, -25, 100, 50);
         button.interactive =true;
         button.buttonMode = true;
        button.y = -200
        button.on('pointerdown', onButtonClicked);

        //6th step: add the button to the restart background 
        background.addChild(button);


        let buttonStyle = new PIXI.TextStyle({
            fontFamily: "Futura",
            fontSize: 20,
            fill: "white"
        });
        //7th add the message button in the button const 
        const buttonText = new PIXI.Text(buttonMessage, buttonStyle);
        buttonText.anchor.x = .5
        buttonText.anchor.y = .5
        button.addChild(buttonText)


        //header text
        const message = new PIXI.Text(title);
        message.y = -400/2 + 20;
        message.anchor.x = 0.5
        message.anchor.y = 0
        background.addChild(message);

        
        
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
    }

    show() {
        this.scene.visible = true
    }
}

export default Popup; // this popup is the name of the class (not the file)

