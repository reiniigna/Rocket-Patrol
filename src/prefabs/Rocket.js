// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);       
        this.isFiring = false;              // track rocket shots
        this.isFiring2 = false;             // track laser shots
        this.laserframe = 0;                // laser frame counter
        this.moveSpeed = 2;                 // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket');  //add rocket sfx
        this.sfxLaser = scene.sound.add('sfx_laser');  //add rocket sfx
        this.p1state = false;
    }


    update() {
        // left/right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            }  else if (keyRIGHT.isDown && this.x <= game.config.width - 
            borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        
        // ************ ROCKET STUFF ************
        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  //play sfx
            
            this.p1state =! this.p1state;
        }

        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding - 100)  {
            this.y -= this.moveSpeed;
        }

        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding - 100)  {
            this.reset();
        }

        // ************ LASER STUFF ************
        // fire button
        if(Phaser.Input.Keyboard.JustDown(keySPACE) && !this.isFiring2) {
            this.isFiring2 = true;
            this.sfxLaser.play();  //play sfx
            this.laserframe += 1;
            
        }


    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}