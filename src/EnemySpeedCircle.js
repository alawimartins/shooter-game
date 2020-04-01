import * as PIXI from 'pixi.js'
import Enemy from './Enemy';
import enemys3 from "./images/enemy3.png"

class EnemySpeedCircle extends Enemy {
    constructor() {
        super();

        
        this.amplitude = Math.random()*5
        

        this.sprite.texture = PIXI.Texture.from(enemys3);
        this.sprite.scale.set(.8)
        this.sprite.tint = Math.random() * 0xffffff;
    }
}

export default EnemySpeedCircle;