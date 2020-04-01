import * as PIXI from 'pixi.js'

import enemyImage from"./images/enemy.png"

class Enemy extends PIXI.Container {
    constructor(){
        super(); // when extending, always call super() to call the "mother class" constructor
        this.tick = Math.random()*40
        this.type = 'linear';

        this.speed = 1;
        this.amplitude= 0
        this.sprite = PIXI.Sprite.from(enemyImage)
        this.sprite.scale.set(.05);
        this.sprite.anchor.set(.5);

        this.addChild(this.sprite);

    }
    
    update () {
        this.tick++; 
    }
}

export default Enemy;