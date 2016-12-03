var level2Complete = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
      game2.stage.backgroundColor = '#000000';
      game3.stage.backgroundColor = '#000000';
  },
  create: function() {
      //game.add.tileSprite(0,0, game.width, game.height, 'levelFailed');
      game.add.text(320, 300, "Level 2 Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      game.add.text(180, 380, "You Can Now Press the Up Arrow to Slow Your Descent", {fontSize: '24px', fill: "#FFF", align: "center"});
      game.add.text(340, 440, "Press ENTER to Start Level 3", {fontSize: '24px', fill: "#FFF", align: "center"});
  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      game.state.start('Level3');
      game2.state.start('Level3_2');
      game3.state.start('Level3_3');
    }
  }
};
