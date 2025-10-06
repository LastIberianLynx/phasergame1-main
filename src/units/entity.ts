// core/entity.ts
import Phaser from 'phaser';

export class Entity {
    x: number = 0;
    y: number = 0;
    rotation: number = 0;
    sprite?: Phaser.GameObjects.Sprite | Phaser.GameObjects.Container;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    update(dt: number) {
        // override in subclasses if needed
    }
}
