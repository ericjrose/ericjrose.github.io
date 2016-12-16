var level3Game1Complete = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
  },
  create: function() {
      //game.add.tileSprite(0,0, game.width, game.height, 'levelFailed');
      game.add.text(320, 300, "Level 3 Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      game.add.text(340, 380, "Press ENTER to start Level 4", {fontSize: '24px', fill: "#FFF", align: "center"});

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
        for (l = 0; l < toClean.length; l++){
          if ((i + 60 > toClean[l])&(i < toClean[l])){
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
      scenery = getRandomInt(1,3);
      level += 1;
      game.state.start('Level');
      game2.state.start('Level_2');
      game3.state.start('Level_3');
    }
  }
};
