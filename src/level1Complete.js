var level1Complete = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
      game2.stage.backgroundColor = '#000000';
      game3.stage.backgroundColor = '#000000';
  },
  create: function() {
      //game.add.tileSprite(0,0, game.width, game.height, 'levelFailed');
      game.add.text(320, 300, "Level 1 Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      game.add.text(160, 380, "You Can Now Press the Right Arrow for an Additional Boost", {fontSize: '24px', fill: "#FFF", align: "center"});
      game.add.text(340, 440, "Press ENTER to Start Level 2", {fontSize: '24px', fill: "#FFF", align: "center"});
  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      game.state.start('Level2');
      game2.state.start('Level2_2');
      game3.state.start('Level2_3');
    }
  }
};
