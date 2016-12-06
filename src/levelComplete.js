var levelComplete = {
  preload: function() {
      //game.stage.backgroundColor = '#000000';
      game2.stage.backgroundColor = '#000000';
      game3.stage.backgroundColor = '#000000';
  },
  create: function() {
      //game.add.tileSprite(0,0, game.width, game.height, 'levelFailed');
      //game.add.text(320, 300, "Level "+ level + " Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      //game.add.text(340, 380, "Press ENTER to Start the Next Level", {fontSize: '24px', fill: "#FFF", align: "center"});
  },
  update: function() {
    // if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
    //   scenery = getRandomInt(1,3);
    //   level += 1;
    //   game.state.start('Level');
    //   game2.state.start('Level_2');
    //   game3.state.start('Level_3');
    // }
  }
};
