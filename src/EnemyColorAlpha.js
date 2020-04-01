import * as PIXI from 'pixi.js'
import Enemy from './Enemy';
import enemys2 from "./images/enemy2.png"

class EnemyColorAlplha extends Enemy {
    constructor() {
        super();

        
        //this.amplitude = Math.random()*5
        

        this.sprite.texture = PIXI.Texture.from(enemys2);
        this.sprite.scale.set(.75)
        this.sprite.tint = 0xff0000;
    }

    update () {
        super.update() 
        this.sprite.alpha = Math.cos(this.tick / 12) 
    }
}

export default EnemyColorAlplha;