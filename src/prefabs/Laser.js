// Rocket prefab
class Laser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.frameCounter = 100;
        this.coolDown = 1;
        this.p1state = true;
        this.visible = false;       
        this.isFiring = false;              // track rocket shots
        this.sfxRocket = scene.sound.add('sfx_rocket');  //add rocket sfx
    }


    update(x, p1state) {
        if (this.p1state != p1state) {
            this.coolDown = 1;
            this.p1state = p1state;
        }
        if (Phaser.Input.Keyboard.JustDown(keySPACE) && this.coolDown > 0) {
            this.isFiring = true;
            this.coolDown = 0;
        }
        // fire button
        if(this.isFiring) {
            //this.visible = true;
            if (this.frameCounter == 100) {
                this.visible = true;
                this.x = x;
                this.sfxRocket.play();  //play sfx
            }
            this.frameCounter -= 1;
        }
        
        // reset on miss
        if(this.frameCounter <= 10)  {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.visible = false;
        //this.x = -1000
        this.frameCounter = 100;
    }

    setX(x) {
        this.x = x;
    }
}