var level2Game1Complete = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
  },
  create: function() {
      //game.add.tileSprite(0,0, game.width, game.height, 'levelFailed');
      game.add.text(320, 300, "Level 2 Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      game.add.text(180, 380, "You Can Now Press the Up Arrow to Slow Your Descent", {fontSize: '24px', fill: "#FFF", align: "center"});
      game.add.text(340, 440, "Press ENTER to Start Level 3", {fontSize: '24px', fill: "#FFF", align: "center"});

      var newData = [];
      var newTraining = [];
      var newY = [];
      var toClean = [];
      for (i = 1; i < X.length; i++){
          var prevXVel =  X[i-1][1];
          var currXVel = X[i][1];
          if (currXVel - prevXVel < -5){
            toClean.push(i);
          };
      };
      //console.log(toClean);
      for (i = 0, j = X.length; i < j; i++){
        toInclude = true;
        for (k = 0; k < toClean.length; k++){
          if ((i + 60 > toClean[k])&(i < toClean[k])){
            toInclude = false;
          };
        };
        if (toInclude){
          newData.push(X[i]);
          newTraining.push(machine.training[i]);
          newY.push(Y[i]);
        };
      }
      X = newData;
      Y = newY;
      machine.training = newTraining;
  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      game.state.start('Level3');
      game2.state.start('Level3_2');
      game3.state.start('Level3_3');
    }
  }
};