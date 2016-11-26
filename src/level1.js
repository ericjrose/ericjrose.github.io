var startX = 100.0;
var startY = 10.0;
// var gravity = 150.0; //250
var restitution = 0;
var PTM = 15.0; // conversion ratio
var cursors;
var background;
var background2;
var squirrelSprite;
var squirrel;
var squirrel2;
var terrain;
var terrain2;
var player;
var player2;
var features;
var text;

var downArrow;
var downArrow2;

var timer;
var timerEvent;

var level = 1;
var levelLength = 25000;
var timeRemaining = 90.0;

var machine = null;
var isDiving = 0;
var k = 5;

var training = true;
var trainingText;

var counter = 1;
var X = [];

var covarNames;
var neighbors;

var Level1 = {
  preload: function(){
    game.load.image('Forest','imgs/Flying Squirrel Forest L1.png');
    game.load.image('Squirrel', 'imgs/Squirrel Cape 01.png');
    game.load.image('Arrow', 'imgs/downArrow.png');

  },
  create: function(){
    game.stage.backgroundColor = '#000000';

    background = game.add.tileSprite(0, 0, 4608, 2307,'Forest'); //Image is 4808x2307
    background.scale.setTo(screen1Width/4608,screen1Height/2307);
    background.fixedToCamera = true;


    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.gravity.y = gravity;
    game.physics.box2d.restitution = restitution;
    //game.physics.box2d.setBoundsToWorld();


    squirrel = new Squirrel(game, 'Squirrel');
    terrain = new Terrain(game, 1, 1, 1);
    player = new Player(game, squirrel, terrain);
    machine = new kNear(5);

    game.camera.bounds = null;
    // game.camera.y = -screen1Height/2;
    game.camera.y = -screen1Height/1.5;
    cursors = game.input.keyboard.createCursorKeys();
    //game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    levelProgress = game.add.graphics(0,0);
    levelProgress.fixedToCamera = true;
    levelProgress.lineStyle(2, 0x000000, 1);
    levelProgress.moveTo(.1*screen1Width,screen1Height*.05)
    levelProgress.lineTo(.9*screen1Width, screen1Height*.05);

    squirrelProgress = game.add.graphics(0,0);
    squirrelProgress.fixedToCamera = true;

    text = game.add.text(screen1Width*.02,screen1Height*.08, 'Level: 1', {fontSize: '20px', fill: '0x000000'});
    text.fixedToCamera = true;

    trainingText = game.add.text(screen1Width*.02,screen1Height*.13, 'Training', {fontSize: '20px', fill: '0x000000'});
    trainingText.fixedToCamera = true;
    keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
    keyE.onDown.add(chngEvalStatus, this);

    timer = game.time.create();
    //timerEvent = timer.add(Phaser.Timer.MINUTE*1 + Phaser.Timer.SECOND*30,this.endTimer,this);
    timerEvent = timer.add(Phaser.Timer.MINUTE*2 + Phaser.Timer.SECOND*0);
    timer.start();

    downArrow = game.add.sprite(screen1Width*.925,screen1Height*0.08, 'Arrow');
    downArrow.scale.setTo(24/786,30/1024);
    downArrow.fixedToCamera = true;

  },
  update: function(){
    squirrelX = squirrel.getPositionX();
    squirrelY = squirrel.getPositionY();

    zoom = Math.min(1, Math.pow((screen1Height-30)/(250-squirrelY),0.75));

    game.world.scale.setTo(zoom);
    background.scale.setTo((1/zoom)*screen1Width/4608,(1/zoom)*screen1Height/2307);
    game.camera.x = squirrelX*zoom - 100;
    //game.camera.y = -screen1Height/2 - screen1Height + screen1Height*zoom;
    game.camera.y = -screen1Height/1.5 - screen1Height + screen1Height*zoom;

    s = Math.round((timerEvent.delay - timer.ms) / 1000);
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    if (s == 0){
      squirrelProgress.destroy();
      squirrelProgress2.destroy();
      game.state.start('levelFailed');
      game2.state.start('levelFailed');
      game3.state.start('levelFailed');
    };
    text.text = "Level: " + 1 + " Time Left: " + minutes.substr(-2) + ":" + seconds.substr(-2);

    text.scale.setTo(1/zoom);
    trainingText.scale.setTo(1/zoom);
    levelProgress.scale.setTo(1/zoom);

    if (training){
      if (cursors.down.isDown) {
        squirrel.dive();
        isDiving = 1;
      } else{
        isDiving = 0;
      };
    } else{
      currFeatures = player.stateToFeatures();
      isDiving = machine.classify(currFeatures);
    };

    if (isDiving == 1){
      downArrow.destroy();
      downArrow = game.add.sprite(screen1Width*.925,screen1Height*0.08, 'Arrow');
      downArrow.scale.setTo(24/(zoom*786),30/(zoom*1024));
      downArrow.fixedToCamera = true;
    } else {
      downArrow.destroy();
    };

    squirrelProgress.destroy();
    squirrelProgress = game.add.graphics(0,0);
    squirrelProgress.fixedToCamera = true;
    squirrelProgress.beginFill(0xFF0000);
    squirrelProgress.drawCircle(.1*screen1Width + .8*screen1Width*squirrelX/levelLength, .05*screen1Height, 20);
    squirrelProgress.endFill();
    squirrelProgress.scale.setTo(1/zoom);

    if (squirrel2 != null){
      squirrel2X = squirrel2.getPositionX();
      squirrel2Y = squirrel2.getPositionY();
      squirrelProgress2.destroy();
      squirrelProgress2 = game.add.graphics(0,0);
      squirrelProgress2.fixedToCamera = true;
      squirrelProgress2.beginFill(0x0000ff);
      squirrelProgress2.drawCircle(.1*screen1Width + .8*screen1Width*squirrel2X/levelLength, .05*screen1Height, 20);
      squirrelProgress2.endFill();
      squirrelProgress2.scale.setTo(1/zoom);
    };

    if (squirrelX > levelLength){
      squirrelProgress.destroy();
      squirrelProgress2.destroy();
      game.state.start('level1Complete');
      game2.state.start('level1Complete');
      game3.state.start('level1Complete');
    };

    if (squirrel2 != null){
      if (squirrel2X > levelLength){
        squirrelProgress.destroy();
        squirrelProgress2.destroy();
        game.state.start('levelFailed');
        game2.state.start('levelFailed');
        game3.state.start('levelFailed');
      };
    };

    terrain.updateKnots(squirrelX/PTM);

    squirrel.updatePosition();

    if (training){
      currFeatures = player.stateToFeatures();
      machine.learn(currFeatures, isDiving);
      X.push(currFeatures);
    };

    //game.camera.focusOnXY(squirrel._body.x + 300.0, squirrel._body.y);
  },
  render: function(){
    //game.debug.box2dWorld();
    //game.debug.cameraInfo(game.camera, 32, 32);
  }
};

var Level1_2 = {
  preload: function(){
    game2.load.image('Forest','imgs/Flying Squirrel Forest L1.png');
    game2.load.image('Squirrel', 'imgs/Squirrel Cape 01.png');
    game2.load.image('Arrow', 'imgs/downArrow.png');
  },
  create: function(){
    game2.stage.backgroundColor = '#000000';

    background2 = game2.add.tileSprite(0, 0, 4608, 2307,'Forest'); //Image is 4808x2307
    background2.scale.setTo(screen2Width/4608,screen2Height/2307);
    background2.fixedToCamera = true;


    game2.physics.startSystem(Phaser.Physics.BOX2D);
    game2.physics.box2d.gravity.y = gravity;
    game2.physics.box2d.restitution = restitution;
    //game.physics.box2d.setBoundsToWorld();

    squirrel2 = new Squirrel(game2, 'Squirrel');
    terrain2 = new Terrain(game2, 1, 1, 2);
    player2 = new Player(game2, squirrel2, terrain2);

    game2.camera.bounds = null;
    game2.camera.y = -screen2Height/2.2;
    cursors = game2.input.keyboard.createCursorKeys();

    squirrelProgress2 = game.add.graphics(0,0);
    squirrelProgress2.fixedToCamera = true;

    downArrow2 = game2.add.sprite(screen2Width*.925,screen2Height*.08, 'Arrow');
    downArrow2.scale.setTo(24/786,30/1024);
    downArrow2.fixedToCamera = true;

  },
  update: function(){
    squirrel2X = squirrel2.getPositionX();
    squirrel2Y = squirrel2.getPositionY();

    zoom2 = Math.min(1, Math.pow((screen2Height-30)/(250-squirrel2Y),0.75));

    game2.world.scale.setTo(zoom2);
    background2.scale.setTo((1/zoom2)*screen2Width/4608,(1/zoom2)*screen2Height/2307);
    game2.camera.x = squirrel2X*zoom2 - 100;
    game2.camera.y = -screen2Height/2.2 - screen2Height + screen2Height*zoom2;

    // squirrelProgress2.destroy();
    // squirrelProgress2 = game.add.graphics(0,0);
    // squirrelProgress2.fixedToCamera = true;
    // squirrelProgress2.beginFill(0x0000ff);
    // squirrelProgress2.drawCircle(100 + 800*squirrel2X/levelLength, 25, 20);
    // squirrelProgress2.endFill();

    terrain2.updateKnots(squirrel2X/PTM);

    squirrel2.updatePosition();

    currFeatures2 = player2.stateToFeatures();

    if (machine != null){
      dive = machine.classify(currFeatures2);
    } else{
      dive = 0;
    };
    if (dive) {
        squirrel2.dive();
    };

    if (dive == 1){
      downArrow2.destroy();
      downArrow2 = game2.add.sprite(screen2Width*.925, screen2Height*.08, 'Arrow');
      downArrow2.scale.setTo(24/(zoom2*786),30/(zoom2*1024));
      downArrow2.fixedToCamera = true;
    } else {
      downArrow2.destroy();
    };


    //game2.camera.x = squirrel2X - 100;
    //game.camera.focusOnXY(squirrel._body.x + 300.0, squirrel._body.y);
  },
  render: function(){
    //game2.debug.box2dWorld();
    //.debug.cameraInfo(game2.camera, 32, 32);
  }
};

var Level1_3 = {
  preload: function(){
    covarNames = ["Grounded","X Vel","Y Vel","Vel","Sq Angle","Deriv 1","Ang to Knot 1","Deriv 2","Ang to Knot 2","Deriv 3","Ang to Knot 3","Dist to Valley","Dist to Apex"];
  },
  create: function(){
    game3.stage.backgroundColor = '#ffffff';

    plotDim = 250;

    circleGraphics = game3.add.graphics(0,0);
    //circleGraphics.beginFill(0xffffff);
    circleGraphics.lineStyle(2, 0xd3d3d3 , 1);
    circleGraphics.drawCircle(screen3Width*0.5, screen3Height*0.5, plotDim);
    //circleGraphics.endFill();

    axisGraphics = game3.add.graphics(0,0);
    axisGraphics.lineStyle(2, 0x000000 , 1);
    axisGraphics.moveTo(screen3Width*0.5, 0);
    axisGraphics.lineTo(screen3Width*0.5, screen3Height);
    axisGraphics.moveTo(0, screen3Height*0.5);
    axisGraphics.lineTo(screen3Width, screen3Height*0.5);

    axisGraphics.moveTo(screen3Width*0.5+plotDim*.5, screen3Height*0.91);
    axisGraphics.lineTo(screen3Width*0.5+plotDim*.5, screen3Height*0.89);
    axisGraphics.moveTo(screen3Width*0.5-plotDim*.5, screen3Height*0.91);
    axisGraphics.lineTo(screen3Width*0.5-plotDim*.5, screen3Height*0.89);
    axisGraphics.moveTo(screen3Width*0.11, screen3Height*0.5+plotDim*.5);
    axisGraphics.lineTo(screen3Width*0.09, screen3Height*0.5+plotDim*.5);
    axisGraphics.moveTo(screen3Width*0.11, screen3Height*0.5-plotDim*.5);
    axisGraphics.lineTo(screen3Width*0.09, screen3Height*0.5-plotDim*.5);
    axisGraphics.moveTo(screen3Width*0.5+plotDim*.25, screen3Height*0.91);
    axisGraphics.lineTo(screen3Width*0.5+plotDim*.25, screen3Height*0.89);
    axisGraphics.moveTo(screen3Width*0.5-plotDim*.25, screen3Height*0.91);
    axisGraphics.lineTo(screen3Width*0.5-plotDim*.25, screen3Height*0.89);
    axisGraphics.moveTo(screen3Width*0.11, screen3Height*0.5+plotDim*.25);
    axisGraphics.lineTo(screen3Width*0.09, screen3Height*0.5+plotDim*.25);
    axisGraphics.moveTo(screen3Width*0.11, screen3Height*0.5-plotDim*.25);
    axisGraphics.lineTo(screen3Width*0.09, screen3Height*0.5-plotDim*.25);

    axisGraphics.moveTo(screen3Width*0.5+plotDim*.5, screen3Height*0.11);
    axisGraphics.lineTo(screen3Width*0.5+plotDim*.5, screen3Height*0.09);
    axisGraphics.moveTo(screen3Width*0.5-plotDim*.5, screen3Height*0.11);
    axisGraphics.lineTo(screen3Width*0.5-plotDim*.5, screen3Height*0.09);
    axisGraphics.moveTo(screen3Width*0.91, screen3Height*0.5+plotDim*.5);
    axisGraphics.lineTo(screen3Width*0.89, screen3Height*0.5+plotDim*.5);
    axisGraphics.moveTo(screen3Width*0.91, screen3Height*0.5-plotDim*.5);
    axisGraphics.lineTo(screen3Width*0.89, screen3Height*0.5-plotDim*.5);
    axisGraphics.moveTo(screen3Width*0.5+plotDim*.25, screen3Height*0.11);
    axisGraphics.lineTo(screen3Width*0.5+plotDim*.25, screen3Height*0.09);
    axisGraphics.moveTo(screen3Width*0.5-plotDim*.25, screen3Height*0.11);
    axisGraphics.lineTo(screen3Width*0.5-plotDim*.25, screen3Height*0.09);
    axisGraphics.moveTo(screen3Width*0.91, screen3Height*0.5+plotDim*.25);
    axisGraphics.lineTo(screen3Width*0.89, screen3Height*0.5+plotDim*.25);
    axisGraphics.moveTo(screen3Width*0.91, screen3Height*0.5-plotDim*.25);
    axisGraphics.lineTo(screen3Width*0.89, screen3Height*0.5-plotDim*.25);

    axisGraphics.moveTo(screen3Width*0.1, screen3Height*0.1);
    axisGraphics.lineTo(screen3Width*0.9, screen3Height*0.1);
    axisGraphics.lineTo(screen3Width*0.9, screen3Height*0.9);
    axisGraphics.lineTo(screen3Width*0.1, screen3Height*0.9);
    axisGraphics.lineTo(screen3Width*0.1, screen3Height*0.1);

    plotText = game3.add.text(screen3Width*.92, screen3Height*0.52, 'Dim 1', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*.52, screen3Height*.95, 'Dim 2', {fontSize: '10px', fill: '0x000000'});

    plotText = game3.add.text(screen3Width*.5+plotDim*0.49, screen3Height*0.92, '1', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*.5-plotDim*0.51, screen3Height*0.92, '-1', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.06, screen3Height*0.5+plotDim*0.475, '-1', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.06, screen3Height*0.5-plotDim*0.525, '1', {fontSize: '10px', fill: '0x000000'});

    plotText = game3.add.text(screen3Width*.5+plotDim*0.23, screen3Height*0.92, '0.5', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*.5-plotDim*0.28, screen3Height*0.92, '-0.5', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.04, screen3Height*0.5+plotDim*0.235, '-0.5', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.04, screen3Height*0.5-plotDim*0.275, '0.5', {fontSize: '10px', fill: '0x000000'});

    plotText = game3.add.text(screen3Width*.5+plotDim*0.48, screen3Height*0.12, '30', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*.5-plotDim*0.52, screen3Height*0.12, '-30', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.92, screen3Height*0.5+plotDim*0.475, '-30', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.92, screen3Height*0.5-plotDim*0.525, '30', {fontSize: '10px', fill: '0x000000'});

    plotText = game3.add.text(screen3Width*.5+plotDim*0.23, screen3Height*0.12, '15', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*.5-plotDim*0.28, screen3Height*0.12, '-15', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.92, screen3Height*0.5+plotDim*0.235, '-15', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.92, screen3Height*0.5-plotDim*0.275, '15', {fontSize: '10px', fill: '0x000000'});

    plotText = game3.add.text(screen3Width*.7,screen3Height*.03, 'PCA Factor Plot', {fontSize: '15px', fill: '0x000000'});

    pcaGraphics = game3.add.graphics(0,0);
    points = game3.add.graphics(0,0);

    pca0Text = null;
  },
  update: function(){
    counter += 1;
    if (counter % 300 == 0){
      pcaGraphics.destroy();
      points.destroy();
      if (pca0Text != null){
        pca0Text.destroy();
        pca1Text.destroy();
        pca2Text.destroy();
        pca3Text.destroy();
        pca4Text.destroy();
        pca5Text.destroy();
        pca6Text.destroy();
        pca7Text.destroy();
        pca8Text.destroy();
        pca9Text.destroy();
        pca10Text.destroy();
        pca11Text.destroy();
        pca12Text.destroy();
      }

      points = game3.add.graphics(0,0);
      points.beginFill(0xff0000);
      points.lineStyle(2, 0xff0000 , 1);

      pc = pca(X);
      pc2 = pcaReduce(pc, 2);
      col0 = pc2.map(function(value,index) { return value[0]; });
      col1 = pc2.map(function(value,index) { return value[1]; });
      dim0 = numeric.dot(col0, currFeatures2);
      dim1 = numeric.dot(col1, currFeatures2);
      console.log(currFeatures2);
      console.log([dim0,dim1]);
      points.drawCircle(screen3Width*0.5 + dim0*plotDim/(30*2), screen3Height*0.5 - dim1*plotDim/(30*2), 2);
      points.endFill();

      neighbors = machine.nearest(currFeatures2);
      console.log(neighbors);
      console.log(neighbors.length);
      for (i = 0; i < neighbors.length; i++){
          dim0 = numeric.dot(col0, neighbors[i].v);
          dim1 = numeric.dot(col1, neighbors[i].v);
          dive = neighbors[i].lab;
          console.log(dive);
          if (dive==0){
            points.beginFill(0x00ff00);
            points.lineStyle(2, 0x00ff00 , 1);
            points.drawCircle(screen3Width*0.5 + dim0*plotDim/(30*2), screen3Height*0.5 - dim1*plotDim/(30*2), 2);
            points.endFill();
          } else{
            points.beginFill(0x551a8b);
            points.lineStyle(2, 0x551a8b , 1);
            points.drawCircle(screen3Width*0.5 + dim0*plotDim/(30*2), screen3Height*0.5 - dim1*plotDim/(30*2), 2);
            points.endFill();
          };
          console.log([dim0,dim1]);
      };

      circleGraphics = game3.add.graphics(0,0);
      //circleGraphics.beginFill(0xffffff);
      circleGraphics.lineStyle(2, 0xd3d3d3 , 1);
      circleGraphics.drawCircle(screen3Width*0.5, screen3Height*0.5, plotDim);
      //circleGraphics.endFill();


      pcaGraphics = game3.add.graphics(0,0);
      pcaGraphics.beginFill(0x0000ff);
      pcaGraphics.lineStyle(2, 0x0000ff , 1);
      for (i = 0; i < pc2.length; i++){
        pcaGraphics.moveTo(screen3Width*0.5, screen3Height*0.5);
        pcaGraphics.lineTo(pc2[i][0]*plotDim/2 + screen3Width*0.5, -pc2[i][1]*plotDim/2 + screen3Height*0.5);
      }
      pca0Text = game3.add.text(pc2[0][0]*plotDim/2 + screen3Width*0.5, -pc2[0][1]*plotDim/2 + screen3Height*0.5, covarNames[0],{fontSize: '10px', fill: '0x000000'});
      pca1Text = game3.add.text(pc2[1][0]*plotDim/2 + screen3Width*0.5, -pc2[1][1]*plotDim/2 + screen3Height*0.5, covarNames[1],{fontSize: '10px', fill: '0x000000'});
      pca2Text = game3.add.text(pc2[2][0]*plotDim/2 + screen3Width*0.5, -pc2[2][1]*plotDim/2 + screen3Height*0.5, covarNames[2],{fontSize: '10px', fill: '0x000000'});
      pca3Text = game3.add.text(pc2[3][0]*plotDim/2 + screen3Width*0.5, -pc2[3][1]*plotDim/2 + screen3Height*0.5, covarNames[3],{fontSize: '10px', fill: '0x000000'});
      pca4Text = game3.add.text(pc2[4][0]*plotDim/2 + screen3Width*0.5, -pc2[4][1]*plotDim/2 + screen3Height*0.5, covarNames[4],{fontSize: '10px', fill: '0x000000'});
      pca5Text = game3.add.text(pc2[5][0]*plotDim/2 + screen3Width*0.5, -pc2[5][1]*plotDim/2 + screen3Height*0.5, covarNames[5],{fontSize: '10px', fill: '0x000000'});
      pca6Text = game3.add.text(pc2[6][0]*plotDim/2 + screen3Width*0.5, -pc2[6][1]*plotDim/2 + screen3Height*0.5, covarNames[6],{fontSize: '10px', fill: '0x000000'});
      pca7Text = game3.add.text(pc2[7][0]*plotDim/2 + screen3Width*0.5, -pc2[7][1]*plotDim/2 + screen3Height*0.5, covarNames[7],{fontSize: '10px', fill: '0x000000'});
      pca8Text = game3.add.text(pc2[8][0]*plotDim/2 + screen3Width*0.5, -pc2[8][1]*plotDim/2 + screen3Height*0.5, covarNames[8],{fontSize: '10px', fill: '0x000000'});
      pca9Text = game3.add.text(pc2[9][0]*plotDim/2 + screen3Width*0.5, -pc2[9][1]*plotDim/2 + screen3Height*0.5, covarNames[9],{fontSize: '10px', fill: '0x000000'});
      pca10Text = game3.add.text(pc2[10][0]*plotDim/2 + screen3Width*0.5, -pc2[10][1]*plotDim/2 + screen3Height*0.5, covarNames[10],{fontSize: '10px', fill: '0x000000'});
      pca11Text = game3.add.text(pc2[11][0]*plotDim/2 + screen3Width*0.5, -pc2[11][1]*plotDim/2 + screen3Height*0.5, covarNames[11],{fontSize: '10px', fill: '0x000000'});
      pca12Text = game3.add.text(pc2[12][0]*plotDim/2 + screen3Width*0.5, -pc2[12][1]*plotDim/2 + screen3Height*0.5, covarNames[12],{fontSize: '10px', fill: '0x000000'});
      pcaGraphics.endFill();
    }
  },
  render: function(){}
};

function pca(X) {
    var m = X.length;
    var sigma = numeric.div(numeric.dot(numeric.transpose(X), X), m);
    return numeric.svd(sigma).U;
}

function pcaReduce(U, k) {
    return U.map(function(row) {
        return row.slice(0, k)
    });
}

function chngEvalStatus(){
  if (training){
    training = false;
    trainingText.text = 'Evaluating';
  } else{
    training = true;
    trainingText.text = 'Training';
  };
};
