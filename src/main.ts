// import Phaser from './lib/phaser.js';
import Phaser from 'phaser';
import { GameScene } from './scenes/game-scene';
// import { SCENE_KEYS } from './common/scene-keys.js';
// import { PreloadScene } from './scenes/preload-scene.js';
// import { GameOverScene } from './scenes/game-over-scene.js';
// import { TitleScene } from './scenes/title-scene.js';

/** @type {Phaser.Types.Core.GameConfig} */
const gameConfig = {
  type: Phaser.WEBGL,
  // pixelArt: true,
  // roundPixels: true,
  scale: {
    parent: 'game-container',
    // start with the current window size and let Phaser resize dynamically
    width: window.innerWidth,
    height: window.innerHeight,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // RESIZE will change the game size to match the parent/container size
    mode: Phaser.Scale.RESIZE,
  },
  // backgroundColor: '#000000',
  // backgroundColor: '#ff00ff', // hot pink
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
};

const game = new Phaser.Game(gameConfig);

game.scene.add('GameScene', GameScene);

game.scene.start('GameScene');

// Keep the game size in sync if the browser window changes size.
// Phaser's RESIZE mode usually handles parent/container resizes, but
// calling `game.scale.resize` on window resize ensures the canvas and
// internal sizes stay correct across browsers.
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

// game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
// game.scene.add(SCENE_KEYS.GAME_SCENE, GameScene);
// game.scene.add(SCENE_KEYS.GAME_OVER_SCENE, GameOverScene);
// game.scene.add(SCENE_KEYS.TITLE_SCENE, TitleScene);
// game.scene.start(SCENE_KEYS.PRELOAD_SCENE);

export default game;