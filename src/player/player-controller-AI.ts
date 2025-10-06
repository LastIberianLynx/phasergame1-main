// player/player-controller-ai.ts
import { PlayerController } from './player-controller';

export class PlayerControllerAI extends PlayerController {
  private moveCooldown = 0;

  update(delta?: number) {
    // Simple AI: move units randomly every second
    // if (!delta) delta = 16; // default delta if not passed
    // this.moveCooldown -= delta;
    // if (this.moveCooldown <= 0) {
    //   const x = Math.random() * 800; // example screen width
    //   const y = Math.random() * 600; // example screen height
    //   this.player.moveUnitsTo(x, y);
    //   this.moveCooldown = 1000; // wait 1 second before next move
    // }
  }
}
