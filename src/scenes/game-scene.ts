

import Phaser from 'phaser';
import { Player } from '../player/player';
import { PlayerController } from '../player/player-controller';
import { PlayerControllerHuman } from '../player/player-controller-human';
import { Ship } from '../units/ship';
import { ColorReplacePipeline } from '../shaders/color-overlay-shader';
// import { OutlinePipeline } from '../shaders/outline-shader';

export class GameScene extends Phaser.Scene {
  #background!: Phaser.GameObjects.Image;
  humanPlayer!: Player; //for convenience. it is not necessary, but we will start with this<
  colorPipeline!: ColorReplacePipeline;
  AllControllers: PlayerController[] = [];
  playerControllerMap = new Map<Player, PlayerController>(); //this is necessary if we need to get the controller from player
  //in some rare occasions that will be necessary.

//   player!: Player;
//   controller!: PlayerController;
  constructor() {
    super('GameScene');
    console.log('GameScene constructor');
  }
  preload() {
    console.log('GameScene preload');
    this.load.image('corvette', 'src/assets/corvette.png');
    this.load.image('phantom', 'src/assets/phantom.png');
    this.load.image('bg', 'src/assets/bg.jpg');
    this.load.image('vanguard', 'src/assets/vanguard.png');
  }
  create() {
    
    //@ts-ignore
    this.input.mouse.disableContextMenu(); // Phaser has a built-in helper
    // this.input.on('pointerdown', function(pointer: Phaser.Input.Pointer) {
    //     if (pointer.rightButtonDown()) {
    //        console.log('Right click detected at', pointer.worldX, pointer.worldY);
    //     }
    // }, this); // <-- important

    // 2. Set world bounds (size of your map)
    const mapWidth = 12000;  // example world width
    const mapHeight = 12000; // example world height

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    // @ts-ignore
    this.colorPipeline = this.renderer.pipelines.add('ColorReplace', new ColorReplacePipeline(this.game));
    this.colorPipeline.setColor(0.0, 1.0, 0.0); // RGB in [0, 1]

    this.#background = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    this.#background.setDepth(-1); // behind everything
    const extra = 100; // pixels beyond screen on each side
    this.#background.setDisplaySize(
        this.scale.width + extra,
        this.scale.height + extra
    );
    // this.#background.setOrigin(0.5, 0.5);
    this.#background.setPosition(this.scale.width / 2, this.scale.height / 2);

    console.log('GameScene created1');
    this.humanPlayer = new Player(this);
    this.humanPlayer.controller = new PlayerControllerHuman(this, this.humanPlayer);
    this.playerControllerMap.set(this.humanPlayer, this.humanPlayer.controller);
    this.humanPlayer.bIsHuman = true;
    this.AllControllers.push(this.humanPlayer.controller);

    // spawn ships
    const ship = new Ship(this, 200, 200, 'corvette', this.humanPlayer);
    this.humanPlayer.units.push(ship);
    const ship2 = new Ship(this, 900, 900, 'phantom', this.humanPlayer);
    this.humanPlayer.units.push(ship2);
        const ship3 = new Ship(this, 900, 600, 'vanguard', this.humanPlayer);
    this.humanPlayer.units.push(ship3);
  }

  update(time: number, delta: number) {
    // this.controller.update();
    // this.player.units.forEach(u => u.update(delta / 1000));

    this.AllControllers.forEach(controller => {
        controller.update();
    });
    this.#handleParallaxBackground();
    
  }

  #spawnPlayer() {
    
  }

  #handleParallaxBackground() {
    const cam = this.cameras.main;

    // Move the background slower than the camera for parallax
    const parallaxFactor = 0.9; // smaller = slower, gives “infinite space” feel

    this.#background.x = cam.scrollX * parallaxFactor;
    this.#background.y = cam.scrollY * parallaxFactor;
}

}
