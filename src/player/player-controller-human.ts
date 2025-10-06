// player/player-controller-human.ts
import Phaser from 'phaser';
import { PlayerController } from './player-controller';
import type { Unit } from '@/units/unit';
import type { Player } from './player';

export class PlayerControllerHuman extends PlayerController {
    private _wasDown = false;
    private _clickConsumed = false; // prevent double fire
    private _dragStart: { x: number; y: number } | undefined;
    private _dragEnd: { x: number; y: number } | undefined;

    private _dragActive = false;
    private _previewLine?: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, player);

        // scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        //     if (pointer.rightButtonDown()) {
        //         console.log('Right click detected at', pointer.worldX, pointer.worldY);
        //         this.#handleRightClick(pointer.worldX, pointer.worldY);
        //     }
        // });
// scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
//     if (pointer.rightButtonReleased()) {
//         const cam = this.scene.cameras.main;
//         const worldX = cam.scrollX + pointer.worldX;
//         const worldY = cam.scrollY + pointer.worldY;

//         const shiftDown = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT).isDown;

//         this.player.selectedUnits.forEach(unit => {
//             // Only clear checkpoints if Shift is NOT held
//             if (!shiftDown) {
//                 unit.movement.clearCheckpoints();
//             }

//             // Always add the new target
//             unit.moveUnitTo(worldX, worldY);
//         });

//         console.log('Right-click released, moving units to:', worldX, worldY, 'Shift:', shiftDown);
//     }
// });

scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    if (pointer.rightButtonDown()) {
        const cam = this.scene.cameras.main;
        this._dragStart = { x: cam.scrollX + pointer.x, y: cam.scrollY + pointer.y };
        this._dragEnd = { ...this._dragStart };
        this._dragActive = true;
    }
});

scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    if (!this._dragActive) return;

    const cam = this.scene.cameras.main;
    this._dragEnd = { x: cam.scrollX + pointer.x, y: cam.scrollY + pointer.y };

    // Draw a line for feedback (optional)
    if (this._dragStart && this._dragEnd) {
        this._drawPreviewLine(this._dragStart, this._dragEnd);
    }

});
scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
    if (!this._dragActive || !this._dragStart || !this._dragEnd) return;

    const dx = this._dragEnd.x - this._dragStart.x;
    const dy = this._dragEnd.y - this._dragStart.y;
    const rotation = Math.atan2(dy, dx);

    // Issue move orders
    this.player.selectedUnits.forEach(unit => {
        const shiftDown = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT).isDown;
        if (!shiftDown) unit.movement.clearCheckpoints();
        unit.moveUnitTo(this._dragStart!.x, this._dragStart!.y, rotation);
    });

    this._dragActive = false;
    this._dragStart = undefined;
    this._dragEnd = undefined;
    this._clearPreviewLine();
});


}

update() {
    super.update();
    this.#handleUnitSelection();
    this.#handleCameraPanning();
    // this.#handleRightClick(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
}

#handleCameraPanning() {
    const cam = this.scene.cameras.main;
    const pointer = this.scene.input.activePointer;
    const panSpeed = 5;
    const edgeSize = 50;

    let moved = false;

    if (pointer.x < edgeSize) { cam.scrollX -= panSpeed; moved = true; }
    else if (pointer.x > this.scene.scale.width - edgeSize) { cam.scrollX += panSpeed; moved = true; }

    if (pointer.y < edgeSize) { cam.scrollY -= panSpeed; moved = true; }
    else if (pointer.y > this.scene.scale.height - edgeSize) { cam.scrollY += panSpeed; moved = true; }

    // if (moved) {
    //     console.log('Camera panning:', cam.scrollX, cam.scrollY, 'Pointer:', pointer.x, pointer.y);
    // }
}


#handleUnitSelection() {
    const pointer = this.scene.input.activePointer;

    // Only trigger left-click selection logic
    if (pointer.leftButtonReleased() && this._wasDown && !this._clickConsumed) {
        this._clickConsumed = true;
        this.#handleClick(pointer.x, pointer.y);
    } else if (pointer.leftButtonDown()) {
        this._wasDown = true;
        this._clickConsumed = false;
    } else {
        this._wasDown = false;
    }
}


#handleClick(screenX: number, screenY: number) {
    const cam = this.scene.cameras.main;
    const worldX = cam.scrollX + screenX;
    const worldY = cam.scrollY + screenY;

    const pointerRect = new Phaser.Geom.Rectangle(worldX, worldY, 1, 1);

    const clickedUnits: Unit[] = [];
    this.player.units.forEach(unit => {
        if (unit.collision.isOverlappingRectangle(pointerRect)) {
            clickedUnits.push(unit);
        }
    });

    if (clickedUnits.length > 0) {
        const additive = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT).isDown;
        this.player.selectUnits(clickedUnits, additive);
        console.log('Units selected:', clickedUnits, 'Additive:', additive);
    } else {
        // LEFT CLICK ONLY: clear selection if shift not held
        this.player.clearUnitsSelection();
        console.log('No units selected, clearing selection.');
    }
}

#handleRightClick(screenX: number, screenY: number) {

    //depr
    const cam = this.scene.cameras.main;
    const worldX = cam.scrollX + screenX;
    const worldY = cam.scrollY + screenY;

    const shiftDown = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT).isDown;

    this.player.selectedUnits.forEach(unit => {
        if (!shiftDown) unit.movement.clearCheckpoints();  // start fresh if Shift not held
        unit.moveUnitTo(worldX, worldY);
    });

    console.log('Moving selected units to:', worldX, worldY, 'Shift:', shiftDown);
}


  private _drawPreviewLine(start: {x:number,y:number}, end: {x:number,y:number}) {
    if (!this._previewLine) {
        this._previewLine = this.scene.add.graphics();
        this._previewLine.lineStyle(2, 0x00ff00);
    }
    this._previewLine.clear();
    this._previewLine.lineBetween(start.x, start.y, end.x, end.y);
}

    private _clearPreviewLine() {
        if (this._previewLine) {
            this._previewLine.clear();
        }
    }


}
