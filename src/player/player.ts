// player/player.ts

import { Unit } from '../units/unit';
import { PlayerController } from './player-controller';

export class Player {
  scene!: Phaser.Scene;
  controller?: PlayerController; 
  units: Unit[] = [];
  selectedUnits: Unit[] = [];
  bIsHuman: boolean = false;

  constructor(scene?: Phaser.Scene) {
    this.scene = scene!;
  }

  selectUnits(units: Unit[], additive: boolean = false) {
    if (!additive) {
        this.selectedUnits.forEach(u => u.setSelected(false));
        this.selectedUnits = [];
    }

    units.forEach(u => {
        if (!this.selectedUnits.includes(u)) {
        this.selectedUnits.push(u);
        u.setSelected(true);
        }
    });
  }

  clearUnitsSelection() {
    this.selectedUnits.forEach(u => u.setSelected(false));
    this.selectedUnits = [];
  }

 moveSelectedUnitsTo(x: number, y: number) {
        this.selectedUnits.forEach(unit => {
            unit.moveUnitTo(x, y); // pushes a checkpoint into MovementComponent
        });
}

//   moveUnitsTo(x: number, y: number) {
//     this.units.forEach(u => {
//       const move = u.getComponent<any>('movement');
//       move?.moveTo(x, y);
//     });
//   }
}
