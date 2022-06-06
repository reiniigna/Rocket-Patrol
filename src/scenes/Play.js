class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('newship', './assets/newship.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('laser', './assets/lasar.png')
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('devil', './assets/devilship.png');
        this.load.image('galaxy', './assets/galaxy.png');

        //load spritesheets
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background (removed because ugly :D)
        //this.add.image(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.image(300, -140,'galaxy');

        // white borders
        //this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        //this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'newship').setOrigin(0.5, 1);
        this.p1Laser = new Laser(this, 0, 35, 'laser').setOrigin(0.5,0);


        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'devil', 0, 30).setOrigin(0,-.8);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'devil', 0, 20).setOrigin(0,-.8);
        this.ship03 = new Spaceship(this, game.config.width + borderUISize*6, borderPadding*4, 'devil', 0, 40).setOrigin(0,-.8);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}), 
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        let scoreConfig2 = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#f55d97',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding -25, borderUISize + borderPadding*2 - 40, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(scoreConfig.fixedWidth + borderUISize + borderPadding - 10, borderUISize + borderPadding*2 -40, this.p2Score, scoreConfig2);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(60000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu',
        scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        
    }

    update() {
    // check key input for restart when game over
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
        this.scene.restart();
    }

    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
        this.scene.start("menuScene");
    }

    if (!this.gameOver)  {
        this.p1Rocket.update();             // update p1
        if(!this.p1Rocket.p1state){
            this.scoreLeft.text = this.p1Score + '*';
            this.scoreRight.text = this.p2Score;
        }
        else{
            this.scoreLeft.text = this.p1Score;
            this.scoreRight.text = this.p2Score + '*';
        }

        if (!this.p1Rocket.isFiring) {
            this.p1Laser.update(this.p1Rocket.x, this.p1Rocket.p1state);
            
        }//this.p1Rocket.x);   
        this.ship01.update();               // update spaceships (x3)
        this.ship02.update();
        this.ship03.update();
    }

    
    this.starfield.tilePositionX -= 4;  // update tile sprite



    if(this.checkCollision(this.p1Rocket, this.ship03)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship03, false);
        }
    if(this.checkCollision(this.p1Laser, this.ship03) && this.p1Laser.frameCounter == 99 && this.p1Laser.isFiring) {
        //this.p1Rocket.reset();
        this.shipExplode(this.ship03, true);
    }
    if(this.checkCollision(this.p1Rocket, this.ship02)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship02, false);
        }
    if(this.checkCollision(this.p1Laser, this.ship02) && this.p1Laser.frameCounter == 99 && this.p1Laser.isFiring) {
        //this.p1Rocket.reset();
        this.shipExplode(this.ship02, true);
        }
    if(this.checkCollision(this.p1Rocket, this.ship01)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship01, false);
        }
    if(this.checkCollision(this.p1Laser, this.ship01) && this.p1Laser.frameCounter == 99 && this.p1Laser.isFiring) {
        //this.p1Rocket.reset();
        this.shipExplode(this.ship01, true);
        }
    
    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if  (rocket.x < ship.x + ship.width &&
             rocket.x + rocket.width > ship.x &&
             rocket.y < ship.y + ship.height &&
             rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship, isLaser) {
        // temporarily hide ship
        ship.alpha = 0; 
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });


        // score add and repaint
       
        if(this.p1Rocket.p1state) {
            if(isLaser){
                this.p2Score += ship.points;
                this.scoreRight.text = this.p2Score;
            }
            else {this.p1Score += ship.points;
                this.scoreLeft.text = this.p1Score;
            }
            
        }

        else {
            if(isLaser){
                this.p1Score += ship.points;
                
            }
            else{
                this.p2Score += ship.points;
            }
            
        }

       
        

        this.sound.play('sfx_explosion');
    }
        
}