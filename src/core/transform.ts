// core/transform.ts
import Phaser from 'phaser';

export interface Transform {
    position: Phaser.Math.Vector2;
    rotation?: number;
}