let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keySPACE;

// set UI sizes
let borderUISize = game.config.height / 15;  // borderUISize  = 32
let borderPadding = borderUISize / 3;        // borderPadding = 10.7