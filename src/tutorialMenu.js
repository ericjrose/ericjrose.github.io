var tutorialMenu = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
      game2.stage.backgroundColor = '#000000';
      game3.stage.backgroundColor = '#000000';
  },
  create: function() {
      game.add.text(180, 300, "Press SPACEBAR to watch a brief tutorial on how to play", {fontSize: '24px', fill: "#FFF", align: "center"});
      game.add.text(340, 380, "Press S to skip the tutorial", {fontSize: '24px', fill: "#FFF", align: "center"});

  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      game.state.start('Tutorial');
      game2.state.start('Tutorial_2');
      game3.state.start('Tutorial_3');
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      game.state.start('Level1');
      game2.state.start('Level1_2');
      game3.state.start('Level1_3');
    }
  }
};
