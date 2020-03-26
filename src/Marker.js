import * as PIXI from 'pixi.js'

class Marker {    
    constructor (data,imageName) {
        this.textSceneWithImage = new PIXI.Container()

        this.basicText = new PIXI.Text(`${data}`);
        this.basicText.anchor.x = 0;
        this.basicText.anchor.y = 0.5;
        this.textSceneWithImage.addChild(this.basicText)

        const image = PIXI.Sprite.from(imageName)

        const widthTarget = 50;
        const scale = widthTarget / 50 // image.width;
        image.scale.set(scale)

        this.textSceneWithImage.addChild(image)
        image.anchor.set(.5)

        image.x = -25; //-image.width 
    }

    updateScore(val) {
        this.basicText.text = val;
    }

    set text (val) {
        this.basicText.text = val;
    }

}
export default Marker;