function collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.stars.countActive(true) === 0) {
        this.stars.children.iterate(function (star) {
            star.enableBody(true, star.x, 0, true, true);
        });
    }
}

class GameScene extends Phaser.Scene {
    private player: Phaser.Physics.Arcade.Sprite;
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars /*: Phaser.Physics.Arcade.Group*/;
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: 'GameScene',
        });
    }

    preload(): void {
        this.load.image('sky', '/assets/sky.png');
        this.load.image('star', '/assets/star.png');
        this.load.image('bomb', '/assets/bomb.png');
        this.load.image('gameOver', '/assets/gameOver.png');
        this.load.image('pressF5', '/assets/pressF5.png');
        this.load.spritesheet('dude', '/assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create(): void {
        // set sky
        this.add.image(400, 300, 'sky');

        // set platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // set player
        this.player = this.physics.add.sprite(100, 450, 'dude');

        // add bounce property to the player
        this.player.setBounce(0.2);

        // keep player inside the scene
        this.player.setCollideWorldBounds(true);

        // collide player and platforms
        this.physics.add.collider(this.player, this.platforms);

        // set stars
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {
                x: 12,
                y: 0,
                stepX: 70,
            },
        });

        // add bounce property to the stars
        this.stars.children.iterate((star) =>
            star.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2))
        );

        // collide stars and platforms
        this.physics.add.collider(this.stars, this.platforms);

        // set overlap action between player and stars
        this.physics.add.overlap(
            this.player,
            this.stars,
            collectStar,
            null,
            this
        );

        // set score
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontSize: '32px',
            fill: 'black',
        });

        // set animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'turn',
            frames: [
                {
                    key: 'dude',
                    frame: 4,
                },
            ],
            frameRate: 20,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        // // set cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(): void {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.space.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}

export default GameScene;
