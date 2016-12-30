var menu = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
      game.load.image('menu','imgs/Flying Squirrels Title Screen L0.5.png')
  },
  create: function() {
      background = game.add.tileSprite(0, 0, 4608, 2307,'menu'); //Image is 4808x2307
      background.scale.setTo(1000/4608,500/2307);
      background.fixedToCamera = true;
  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      game.state.start('tutorialMenu');
      game2.state.start('tutorialMenu');
      game3.state.start('tutorialMenu');
    }
  }
};
