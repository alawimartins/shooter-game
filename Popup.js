class Popup {
    constructor(title, buttonMessage, onButtonClicked) {
        //container
        this.scene = new PIXI.Container();
        
        //we will create a background
        const background = new PIXI.Graphics();
        background.beginFill(0xff0000); 
        background.drawRect(-200, -200, 400, 400);
        this.scene.addChild(background)
        
        //button
        const button = new PIXI.Graphics();
        button.beginFill(0x000000); 
        button.drawRect(-50, -25, 100, 50);
        button.interactive =true;
        button.buttonMode = true;
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
        message.y = -background.height/2 + 20;
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



// //1st step is to create a container where all the elements will be added to it.
// const wonScene = new PIXI.Container();
// stage.addChild(wonScene);
// wonScene.visible = false;

// //2nd step is to do the background of the message, which in this case is a rectangle
// const background = new PIXI.Graphics();
// background.beginFill(0xff0000); //adding color to the rectangle
// background.drawRect(-200, -200, 400, 400); //setting the anchor and mesures
// //3rd step is to add the background to the container WonScene. 
// //Note: there is no need to add this to the stage as the whole container is already added to the stage.
// wonScene.addChild(background);

// //4th add a message at the top of the pop-up and add it to to the Pixi.graphics created above (background)
// const message = new PIXI.Text("You Won!");
// message.y = -background.height/2 + 20;
// message.anchor.x = 0.5
// message.anchor.y = 0
// background.addChild(message);


// //5th step to add the click button to go to next level 
// //for this you will need to create a rectangle with a text inside by using Pixi.Graphics 
// //and Pixi text and adding this to the restart background
// const nextLevelButton = new PIXI.Graphics();
// nextLevelButton.beginFill(0x000000); 
// nextLevelButton.drawRect(-50, -25, 100, 50);

// //6th step: add the button to the restart background 
// background.addChild(nextLevelButton);

// let nextLevelButtonStyle = new PIXI.TextStyle({
//     fontFamily: "Futura",
//     fontSize: 20,
//     fill: "white"
// });
// //7th add the message button in the button const 
// const nextLevelText = new PIXI.Text("nextLevel", nextLevelButtonStyle);
// nextLevelText.anchor.x = .5
// nextLevelText.anchor.y = .5
// nextLevelButton.addChild(nextLevelText)