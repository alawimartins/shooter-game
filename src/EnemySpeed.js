import * as PIXI from 'pixi.js';
import Enemy from './Enemy';
import enemys2 from "./images/enemy2.png"


class EnemySpeed extends Enemy {
    constructor() {
        super();

        this.speed = 2.3 + Math.random();

        this.sprite.texture = PIXI.Texture.from(enemys2);
        this.sprite.scale.set(1)
    }
}

export default EnemySpeed;