// components/movementComponent.ts
import Phaser from 'phaser';
import type { Transform } from '../core/transform'; // Assuming Transform has { position: Vector2 }

export class MovementComponent {
    checkpoints: Transform[] = [];
    moveSpeed = 100;       // pixels per second
    rotateSpeed = 0.01;     // radians per frame

    // Current position and rotation
    x: number = 0;
    y: number = 0;
    rotation: number = 0;

    constructor(x: number = 0, y: number = 0, rotation: number = 0) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    update(dt: number) {
        if (this.checkpoints.length === 0) return;
        //@ts-ignore
        const target = this.checkpoints[0].position;

        // Direction vector
        const dir = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y);
        const distance = dir.length();

        if (distance < 2) {
            // Reached checkpoint
            this.x = target.x;
            this.y = target.y;
            this.checkpoints.shift();
            return;
        }

        dir.normalize();

        // Move toward target
        const moveStep = this.moveSpeed * (dt / 1000);
        this.x += dir.x * moveStep;
        this.y += dir.y * moveStep;
        // console.log(`Moving to (${target.x.toFixed(1)}, ${target.y.toFixed(1)}), Current position: (${this.x.toFixed(1)}, ${this.y.toFixed(1)})`);
        // Rotate smoothly toward target
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, targetAngle, this.rotateSpeed);
        
    }

    moveTo(x: number, y: number, rotation?: number) {
        this.checkpoints.push({ position: new Phaser.Math.Vector2(x, y) });
    }

    clearCheckpoints() {
        this.checkpoints = [];
    }
}
