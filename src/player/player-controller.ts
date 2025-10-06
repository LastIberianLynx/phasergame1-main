

// player/player-controller.ts
import Phaser from 'phaser';
import { Player } from './player';

export class PlayerController {
  constructor(protected scene: Phaser.Scene, protected player: Player) {}

  getControlledPlayer() { return this.player; }

  update() {
    if (this.scene.input.activePointer.isDown) {
      const { x, y } = this.scene.input.activePointer;
    //   this.player.moveUnitsTo(x, y);

    }
    this.player.units.forEach(unit => {
        unit.update(this.scene.game.loop.delta);
    })
  }
}
