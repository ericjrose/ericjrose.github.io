var levelFailed = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
      game2.stage.backgroundColor = '#000000';
      game3.stage.backgroundColor = '#000000';
  },
  create: function() {
      //game.add.tileSprite(0,0, game.width, game.height, 'levelFailed');
      game.add.text(400, 300, "You Lost!", {fontSize: '48px', fill: "#FFF", align: "center"});
      game.add.text(380, 380, "Press ENTER to Restart", {fontSize: '24px', fill: "#FFF", align: "center"});
  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      game.state.start('Level1');
      game2.state.start('Level1_2');
      game3.state.start('Level1_3');
    }
  }
};
