import * as PIXI from 'pixi.js'
//

class Popup {
    constructor(title, onButtonClicked,buttonType, sign) {
        //container
        this.scene = new PIXI.Container();
        
        //we will create a background
        const background = new PIXI.Sprite.from(sign)
        background.anchor.y = 1
        background.anchor.x = 0.5
        background.scale.set(1.8) 
        this.scene.addChild(background)
        
        //button
        const button = new PIXI.Sprite.from(buttonType)
       
        
        
        // button.beginFill(0x000000); 
        // button.drawRect(-50, -25, 100, 50);
         button.interactive =true;
         button.buttonMode = true;
        button.y = -340*1.8/2
        button.anchor.set(.5)
        button.on('pointerdown', onButtonClicked);

        //6th step: add the button to the restart background 
        this.scene.addChild(button);


        //header text
        const message = new PIXI.Text(title, {fontFamily: 'Press Start 2P', fontSize: 25, fill: 'black', wordWrap:true, wordWrapWidth:400, leading:20, align:"center"});
        message.y = -520;
        message.anchor.x = 0.5
        message.anchor.y = 0
        this.scene.addChild(message);

        
        
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

