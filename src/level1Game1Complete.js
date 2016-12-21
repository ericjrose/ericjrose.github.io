var level1Game1Complete = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
  },
  create: function() {
      //game.add.tileSprite(0,0, game.width, game.height, 'levelFailed');
      game.add.text(320, 300, "Level 1 Complete", {fontSize: '48px', fill: "#FFF", align: "center"});
      game.add.text(160, 380, "You Can Now Press the Right Arrow for an Additional Boost", {fontSize: '24px', fill: "#FFF", align: "center"});
      game.add.text(340, 440, "Press ENTER to Start Level 2", {fontSize: '24px', fill: "#FFF", align: "center"});

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

      var kmeans = new KMeans();
      var clusters = kmeans.cluster(X, numPrinPoints);
      machine.principalPoints = kmeans.centroids;
      machine.updateClusters();

  },
  update: function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      game.state.start('Level2');
      game2.state.start('Level2_2');
      game3.state.start('Level2_3');
    }
  }
};

// function clean(data){
//   var newData = [];
//   var toClean = [];
//   for (i = 1; i < data.length; i++){
//       var prevXVel =  data[i-1][1];
//       var currXVel = data[i][1];
//       if (currXVel - prevXVel < -5){
//         toClean.push(i);
//       };
//   };
//   for (i = 0, j = data.length; i < j; i++){
//     toInclude = true;
//     for (k = 0; k < toClean.length; k++){
//       if ((i + 60 > toClean[k])&(i < toClean[k])){
//         toInclude = false;
//       };
//     };
//     if (toInclude){
//       newData.push(data[i]);
//     };
//   };
//   return newData
  //  for (i = toClean.length-1; i > -1; i--){
  //    var delNum = toClean[i] - toClean[i-1];
  //    if (delNum > 60){
  //      delNum = 60;
  //    }
    //  console.log("First " + testArray);
    //  var testArray = [1, 2, 3, [4, 5], [6,7]];
    //  console.log("Second " + testArray);
    //  var removed = testArray.splice(2,2);
    //  console.log("Third " + testArray);
    //  console.log(removed);
  //   console.log('DelNum: '+ delNum);
  //   console.log('toClean: '+ toClean[i]);
  //   console.log('Pre Data: ' + data);
  //   var removed = data.splice(toClean[i] - delNum + 1, delNum);
  //   console.log('Removed: ' + removed);
  //   console.log('Post Data: 'data);
  //  };
  //  return newData;
//}
