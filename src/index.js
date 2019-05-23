import Phaser from "phaser";
import * as gameScene from './gameScene/gameScene'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 350 },
          debug: false
      }
  },
  scene: gameScene
};

const game = new Phaser.Game(config);


