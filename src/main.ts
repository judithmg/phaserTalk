import 'phaser';
import GameScene from './scenes/gameScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 350
            },
            debug: false
        }
    },
    scene: GameScene
};

new Phaser.Game(config);
