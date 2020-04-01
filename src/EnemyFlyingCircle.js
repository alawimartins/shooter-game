import * as PIXI from 'pixi.js'
import Enemy from './Enemy';
import enemys4 from "./images/mosquito.png"

class EnemyFlyingCircle extends Enemy {
    constructor() {
        super();

        
        //this.amplitude = Math.random()*5
        this.speed = 0
        this.type = "circle"

        this.sprite.texture = PIXI.Texture.from(enemys4);
        this.sprite.scale.set(.8)
    }
    update() {
        super.update()

        this.sprite.position.x = Math.cos(this.tick/20)*100
        this.sprite.position.y = Math.sin(this.tick/20)*100
    }
}

export default EnemyFlyingCircle;