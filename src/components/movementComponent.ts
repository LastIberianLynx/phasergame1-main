// components/movementComponent.ts
import Phaser from 'phaser';
import type { Transform } from '../core/transform';

export class MovementComponent {
    checkpoints: Transform[] = [];
    moveSpeed = 100;      // pixels per second
    rotateSpeed = 0.05;   // radians per frame
    x = 0;
    y = 0;
    rotation = 0;

    constructor(x: number = 0, y: number = 0, rotation: number = 0) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    update(dt: number) {
        if (this.checkpoints.length === 0) return;

        const current = this.checkpoints[0]!;
        const targetPos = current.position;
        const targetRot = current.rotation; // may be undefined

        const dir = new Phaser.Math.Vector2(targetPos.x - this.x, targetPos.y - this.y);
        const distance = dir.length();

        // --- Movement ---
        if (distance > 1) {
            dir.normalize();
            const step = this.moveSpeed * (dt / 1000);
            this.x += dir.x * step;
            this.y += dir.y * step;
        }

        // --- Rotation toward movement direction or target rotation ---
        const desiredAngle = 
            targetRot !== undefined 
                ? targetRot
                : Phaser.Math.Angle.Between(this.x, this.y, targetPos.x, targetPos.y);

        this.rotation = this.approachRotation(this.rotation, desiredAngle, this.rotateSpeed);

        // --- Check if reached ---
        if (distance < 2 && (targetRot === undefined || Math.abs(Phaser.Math.Angle.Wrap(this.rotation - targetRot)) < 0.05)) {
            this.x = targetPos.x;
            this.y = targetPos.y;
            this.checkpoints.shift(); // next waypoint
        }
    }

    moveTo2(x: number, y: number, rotation?: number) {
        this.checkpoints.push({
            position: new Phaser.Math.Vector2(x, y),
            rotation: rotation ?? 0 // fallback to 0 if undefined
        });
    }

    clearCheckpoints() {
        this.checkpoints = [];
    }

    private approachRotation(current: number, target: number, maxDelta: number): number {
        const diff = Phaser.Math.Angle.Wrap(target - current);
        if (Math.abs(diff) <= maxDelta) return target;
        return current + Math.sign(diff) * maxDelta;
    }
}
