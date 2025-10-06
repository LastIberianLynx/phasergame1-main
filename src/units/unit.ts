import Phaser from 'phaser';
import { Player } from '@/player/player';
import { CollisionComponent } from '../components/collisionComponent';
import { MovementComponent } from '../components/movementComponent';

export class Unit extends Phaser.GameObjects.Container {
    // container: Phaser.GameObjects.Container;   // container holding sprite + outline
    sprite: Phaser.GameObjects.Sprite;         // main unit sprite
    outlineSprite: Phaser.GameObjects.Sprite;  // green outline sprite
    selected: boolean = false;
    owner: Player;
    collision!: CollisionComponent;

    movement: MovementComponent;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, owner: Player) {
        super(scene, x, y);

        this.owner = owner;

        // 1️⃣ Create container at unit position
        // this.container = scene.add.container(x, y);

        // 2️⃣ Create main sprite
        this.sprite = scene.add.sprite(0, 0, texture);

        // 3️⃣ Create outline sprite (slightly bigger)
        this.outlineSprite = scene.add.sprite(0, 0, texture);
        this.sprite.setScale(0.5);
        this.outlineSprite.setDisplaySize(20, 20);
        this.outlineSprite.setScale(0.6);
        this.outlineSprite.setPipeline('ColorReplace'); // your shader
        this.outlineSprite.setVisible(false);

        // 4️⃣ Add both to container (outline below main sprite)
        this.add([this.outlineSprite, this.sprite]);

        // 5️⃣ Setup collision component
        this.collision = new CollisionComponent(this);

        // 6️⃣ Create movement component
        this.movement = new MovementComponent();
        this.movement.x = x;
        this.movement.y = y;
        this.movement.rotation = 0;

        scene.add.existing(this);
    }

    update(dt: number) {
        super.update(dt);
        // console.log('Unit Update - Position:', this.x.toFixed(1), this.y.toFixed(1));
        // Update movement
        this.movement.update(dt);

        // Sync container position/rotation with movement component
        this.x = this.movement.x;
        this.y = this.movement.y;
        this.rotation = this.movement.rotation;
    }

    setSelected(bSelected: boolean = true) {
        this.selected = bSelected;
        this.outlineSprite.setVisible(bSelected);
    }

    containsPoint(x: number, y: number) {
        const bounds = this.sprite.getBounds();
        return bounds.contains(x, y);
    }

    takeDamage(amount: number) {
        console.log(`Unit took ${amount} damage`);
    }

    moveUnitTo(x: number, y: number, rotation?: number) {
        this.movement.moveTo(x, y, rotation); // delegates to MovementComponent
    }


    // moveTo(x: number, y: number) {
    //     this.movement.moveTo(x, y);
    // }
}
