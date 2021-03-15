import 'phaser';
import GameScene from './scenes/gameScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: GameScene
};

new Phaser.Game(config);
