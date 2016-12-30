var tutorialComplete = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
      game2.stage.backgroundColor = '#000000';
      game3.stage.backgroundColor = '#000000';
  },
  create: function() {
      game.add.text(320, 300, "Tutorial Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      game.add.text(360, 380, "Press ENTER to Start Level 1", {fontSize: '24px', fill: "#FFF", align: "center"});

  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      game.state.start('Level1');
      game2.state.start('Level1_2');
      game3.state.start('Level1_3');
    }
  }
};
