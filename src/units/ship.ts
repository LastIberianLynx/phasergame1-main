import Phaser from 'phaser';
import { Unit } from './unit';
import { Player } from '../player/player';
import { ColorReplacePipeline } from '../shaders/color-overlay-shader';

export class Ship extends Unit {

  bShield: boolean = false; // Example property

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, owner: Player) {
    super(scene, x, y, texture, owner);
    // order: outline first (below), ship second (on top)

    // Optional: add shield graphics if needed
    this.#toggleShield(scene, false);
  }

  update(dt: number) {
    super.update(dt);

    // Sync container position with ship logic if needed
    // this.container.setPosition(this.sprite.x, this.sprite.y);
    // this.container.setRotation(this.sprite.rotation);
  }


  #toggleShield(scene: Phaser.Scene, enable: boolean = true) {
    if (enable) {
      this.bShield = true;
      // optionally add graphics to container
    } else {
      this.bShield = false;
    }
  }
}
