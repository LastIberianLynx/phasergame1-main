import Phaser from 'phaser';
import { Unit } from '../units/unit';

export class CollisionComponent {
    unit: Unit;
    scene: Phaser.Scene;

    constructor(unit: Unit) {
        this.unit = unit;
        this.scene = unit.owner.scene;

        // Add Arcade Physics body
        this.scene.physics.add.existing(this.unit.sprite);

        // Now the body exists
        const body = this.unit.sprite.body as Phaser.Physics.Arcade.Body | null;
        if (body) {
            const radius = this.unit.sprite.width / 4;
            body.setCircle(radius);
            body.setOffset(
                (this.unit.sprite.width / 2) - radius,
                (this.unit.sprite.height / 2) - radius
            );
            body.setImmovable(true);
            body.setCollideWorldBounds(true);
            body.enable = true;

            // Enable debug display
            body.debugShowBody = true;
            body.debugBodyColor = 0x00ff00;

            console.log('CollisionComponent initialized for unit:', this.unit);
        } else {
            console.warn('CollisionComponent: physics body not found for unit:', this.unit);
        }
    }

    // Example overlap helper
    isOverlappingRectangle(rect: Phaser.Geom.Rectangle): boolean {
        const body = this.unit.sprite.body as Phaser.Physics.Arcade.Body | null;
        if (!body) return false;
        const bounds = new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height);
        return Phaser.Geom.Intersects.RectangleToRectangle(rect, bounds);
    }
}
