function playerLoses(player, gilbe) {
    player.disableBody(true, true);
    this.vida -= 1;

    this.livesText.setText(`Lives: ${this.vida}`);
}

function collectPhaser(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.score === 100) {
        console.log('you are almost there!!');
    }
}

function winGame(player, skylab) {
    if (this.score === 100) {
        console.log('YOU WIN');
    }
    this.winText.setText('YOU WIN!!!!!!');
}

class GameScene extends Phaser.Scene {
    private player: Phaser.Physics.Arcade.Sprite;
    private player2: Phaser.Physics.Arcade.Sprite;
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars: Phaser.Physics.Arcade.Group;
    private score: number = 0;
    private vida: number = 2;
    private scoreText: Phaser.GameObjects.Text;
    private livesText: Phaser.GameObjects.Text;
    private winText: Phaser.GameObjects.Text;
    private currentPlayer;
    private skylab: Phaser.Physics.Arcade.StaticGroup;
    private baddie: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super({
            key: 'GameScene',
        });
    }

    preload(): void {
        this.load.image('sky', '/assets/sky.png');
        this.load.image('ground', '/assets/platform.png');
        this.load.image('mini', '/assets/platform-mini.png');
        this.load.image('star', '/assets/phaser.png');
        this.load.image('skylab', '/assets/skylab.png');
        this.load.image('gilbe', '/assets/gilbe.png');
        this.load.image('angular', '/assets/angular.png');
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

        this.baddie = this.physics.add
            .sprite(800, 50, 'gilbe')
            .setVelocity(200, 200)
            .setBounce(1)
            .setGravity(0.5, 0.5)
            .setCollideWorldBounds(true);

        // set platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(800, 400, 'ground');
        this.platforms.create(10, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        this.platforms.create(50, 100, 'mini');
        this.platforms.create(100, 450, 'mini');
        this.platforms.create(400, 350, 'mini');

        this.skylab = this.physics.add.staticGroup();
        this.skylab.create(730, 340, 'skylab');

        // set player

        this.player = this.physics.add.sprite(200, 450, 'dude').setBounce(0.2);
        this.player2 = this.physics.add
            .sprite(300, 450, 'dude')
            .setTint(0xff0022)
            .setBounce(0.2);

        this.currentPlayer = this.player;

        // collide player and platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);
        this.physics.add.collider(this.baddie, this.platforms);

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 9,
            setXY: {
                x: 32,
                y: 0,
                stepX: 70,
            },
        });

        // add bounce property to the stars

        // collide stars and platforms
        this.physics.add.collider(this.stars, this.platforms);

        // set overlap action between player and stars
        this.physics.add.overlap(
            this.player,
            this.baddie,
            playerLoses,
            null,
            this
        );
        // set overlap action between player and stars
        this.physics.add.overlap(
            this.player2,
            this.baddie,
            playerLoses,
            null,
            this
        );
        this.physics.add.overlap(
            this.player,
            this.stars,
            collectPhaser,
            null,
            this
        );
        this.physics.add.overlap(
            this.player2,
            this.stars,
            collectPhaser,
            null,
            this
        );
        this.physics.add.overlap(
            this.player2,
            this.skylab,
            winGame,
            null,
            this
        );

        this.physics.add.overlap(this.player, this.skylab, winGame, null, this);

        // set score
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontSize: '32px',
            fill: 'black',
        });
        this.livesText = this.add.text(516, 16, `Lives: ${this.vida}`, {
            fontSize: '32px',
            fill: 'black',
        });

        this.winText = this.add.text(100, 200, '', {
            fontSize: '100px',
            fill: 'yellow',
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

        this.input.on(
            'pointerdown',
            function () {
                if (this.currentPlayer === this.player) {
                    this.player.setVelocityX(0);
                    this.player.anims.play('turn');
                    this.currentPlayer = this.player2;
                } else {
                    this.currentPlayer.setVelocityX(0);
                    this.currentPlayer.anims.play('turn');
                    this.currentPlayer = this.player;
                }
            },
            this
        );
    }

    update(): void {
        this.physics.world.wrap(this.currentPlayer);

        if (this.cursors.left.isDown) {
            this.currentPlayer.setVelocityX(-160);
            this.currentPlayer.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.currentPlayer.setVelocityX(160);
            this.currentPlayer.anims.play('right', true);
        } else {
            this.currentPlayer.setVelocityX(0);
            this.currentPlayer.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.currentPlayer.body.touching.down) {
            this.currentPlayer.setVelocityY(-330);
        }
    }
}

export default GameScene;
