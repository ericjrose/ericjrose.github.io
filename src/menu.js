var menu = {
  preload: function() {
    game.stage.backgroundColor = '#000000';
    game.load.image('menu','imgs/Flying Squirrels Title Screen L0.5.png');
    game.load.audio('Music', 'sounds/Wallpaper.mp3');
  },
  create: function() {
    music = game.add.audio('Music');
    music.loop = true;
    music.play()

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.input.onDown.add(goFull, this);

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(startTutorialMenu, this);

    background = game.add.tileSprite(0, 0, 4608, 2307,'menu'); //Image is 4808x2307
    background.scale.setTo(screenWidth/4608,screenHeight/2307);
    background.fixedToCamera = true;
  }
};

function startTutorialMenu(){
  game.state.start('tutorialMenu');
};
