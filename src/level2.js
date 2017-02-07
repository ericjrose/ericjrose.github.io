// var startX = 100.0;
// var startY = 10.0;
// var restitution = 0;
// var PTM = 15.0; // conversion ratio
// var cursors;
// var background;
// var squirrelSprite;
// var squirrel;
// var terrain;
// var player;
// var features;
// var text;
//
// var downArrow;
//
// var timer;
// var timerEvent;
//
// var level;
var level2Length = 27500;

var boostAvail = true;
var boostMeter;
var boostRecharge = 600;
var boostTimer = boostRecharge;

var boostLength = 5;
var boostCurr = 5;

var acornRecharge = 300;

// var isDiving = 0;
// var k = 5;


var Level2 = {
  preload: function(){
    //game.load.image('Desert','imgs/Flying Squirrel Desert L2.png');
    game.load.image('Desert','imgs/Flying Squirrel Desert Cropped 72ppi.gif');
    game.load.image('Squirrel', 'imgs/Squirrel JetPack 02.png');
    game.load.image('Arrow', 'imgs/downArrow.png');
    game.load.image('Cloud1', 'imgs/cloudDesert1.png');
    game.load.image('Cloud2', 'imgs/cloudDesert2.png');
    game.load.image('Cloud3', 'imgs/cloudDesert3.png');
    game.load.image('Acorn', 'imgs/acorn2.png');
  },
  create: function(){
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.input.onDown.add(goFull, this);

    // Uncomment when starting from level 1
    //console.log(machine.training.length);
    prevDataLength = machine.training.length;

    game.stage.backgroundColor = '#000000';
    level = 2;

    //background = game.add.tileSprite(0, 0, 4608, 2307,'Desert'); //Image is 4808x2307
    //background.scale.setTo(screen1Width/4608,screen1Height/2307);
    background = game.add.tileSprite(0, 0, 656, 554,'Desert'); //Image is 656x554
    background.scale.setTo(screen1Width/656,screen1Height/554);
    background.fixedToCamera = true;


    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.gravity.y = gravity;
    game.physics.box2d.restitution = restitution;
    //game.physics.box2d.setBoundsToWorld();

    squirrel = new Squirrel(game, 'Squirrel');
    terrain = new Terrain(game, 2, 2, 1, 'Cloud1','Cloud2','Cloud3', 'Acorn');
    player = new Player(game, squirrel, terrain, level);
    //machine = new kNear(5);
    //machine.setK(k);

    frontGroup = game.add.group();
    statGroup = game.add.group();

    squirrel.squirrelSprite.body.setCategoryContactCallback(3, this.acornCollision, this);

    game.camera.bounds = null;
    game.camera.y = -screen1Height/1.5;
    cursors = game.input.keyboard.createCursorKeys();
    //game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    //game.input.keyboard.addKeyCapture([Phaser.Keyboard.SHIFT]);


    levelProgress = game.add.graphics(0,0);
    levelProgress.fixedToCamera = true;
    levelProgress.lineStyle(2, 0x000000, 1);
    levelProgress.moveTo(.1*screen1Width,screen1Height*.05)
    levelProgress.lineTo(.9*screen1Width, screen1Height*.05);

    boostMeter = game.add.graphics(0,0);
    boostMeter.fixedToCamera = true;
    boostMeter.lineStyle(4, 0x000000, 1);
    boostMeter.beginFill(0x000000);
    boostMeter.drawRect(screen1Width*.8,screen1Height*.1,screen1Width*.1,screen1Height*0.04);
    boostMeter.endFill();

    boostFill = game.add.graphics(0,0);
    boostFill.fixedToCamera = true;

    squirrelProgress = game.add.graphics(0,0);
    squirrelProgress.fixedToCamera = true;

    text = game.add.text(screen1Width*.02,screen1Height*.08, 'Level: 2', {fontSize: '20px', fill: '0x000000'});
    text.fixedToCamera = true;

    if (training){
      trainingText = game.add.text(screen1Width*.02,screen1Height*.13, 'Training', {fontSize: '20px', fill: '0x000000'});
    }else{
      trainingText = game.add.text(screen1Width*.02,screen1Height*.13, 'Evaluating', {fontSize: '20px', fill: '0x000000'});
    };
    trainingText.fixedToCamera = true;
    keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
    keyE.onDown.add(chngEvalStatus, this);
    keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
    keyP.onDown.add(pause, this);

    timer = game.time.create();
    timerEvent = timer.add(Phaser.Timer.MINUTE*2 + Phaser.Timer.SECOND*0);
    timer.start();

    downArrow = game.add.sprite(screen1Width*.925,screen1Height*0.08, 'Arrow');
    downArrow.scale.setTo(24/786,30/1024);
    downArrow.fixedToCamera = true;

    sideCanvas = game.add.graphics(0,0);
    sideCanvas.beginFill(0xffffff);
    sideCanvas.drawRect(screenWidth*0.67, 0, screenWidth*0.33, screenHeight);
    sideCanvas.endFill();
    sideCanvas.fixedToCamera = true;

    rateText = game.add.text(screenWidth*0.7, screen2Height*0.1, 'Misclassification Rate:', {fontSize: '14px', fill: '0xffffff'});
    tpText = game.add.text(screenWidth*0.7, screen2Height*0.2, 'True Positive Rate:', {fontSize: '14px', fill: '0xffffff'});
    fpText = game.add.text(screenWidth*0.7, screen2Height*0.3, 'False Positive Rate:', {fontSize: '14px', fill: '0xffffff'});
    specText = game.add.text(screenWidth*0.7, screen2Height*0.4, 'Specificity:', {fontSize: '14px', fill: '0xffffff'});
    precText = game.add.text(screenWidth*0.7, screen2Height*0.5, 'Precision:', {fontSize: '14px', fill: '0xffffff'});
    prevText = game.add.text(screenWidth*0.7, screen2Height*0.6, 'Prevalence:', {fontSize: '14px', fill: '0xffffff'});

    rateText.fixedToCamera = true;
    tpText.fixedToCamera = true;
    fpText.fixedToCamera = true;
    specText.fixedToCamera = true;
    precText.fixedToCamera = true;
    prevText.fixedToCamera = true;

    plotDim = 250;

    circleGraphics = game.add.graphics(0,0);
    //circleGraphics.beginFill(0xffffff);
    circleGraphics.lineStyle(2, 0xd3d3d3 , 1);
    circleGraphics.drawCircle(screen1Width + screen3Width*0.5, screen2Height + screen3Height*0.5, plotDim);
    //circleGraphics.endFill();

    axisGraphics = game.add.graphics(0,0);
    axisGraphics.lineStyle(2, 0x000000 , 1);
    axisGraphics.moveTo(screen1Width + screen3Width*0.5, screen2Height);
    axisGraphics.lineTo(screen1Width + screen3Width*0.5, screen2Height + screen3Height);
    axisGraphics.moveTo(screen1Width, screen2Height + screen3Height*0.5);
    axisGraphics.lineTo(screen1Width + screen3Width, screen2Height + screen3Height*0.5);

    axisGraphics.moveTo(screen1Width + screen3Width*0.5+plotDim*.5, screen2Height + screen3Height*0.91);
    axisGraphics.lineTo(screen1Width + screen3Width*0.5+plotDim*.5, screen2Height + screen3Height*0.89);
    axisGraphics.moveTo(screen1Width + screen3Width*0.5-plotDim*.5, screen2Height + screen3Height*0.91);
    axisGraphics.lineTo(screen1Width + screen3Width*0.5-plotDim*.5, screen2Height + screen3Height*0.89);
    axisGraphics.moveTo(screen1Width + screen3Width*0.11, screen2Height + screen3Height*0.5+plotDim*.5);
    axisGraphics.lineTo(screen1Width + screen3Width*0.09, screen2Height + screen3Height*0.5+plotDim*.5);
    axisGraphics.moveTo(screen1Width + screen3Width*0.11, screen2Height + screen3Height*0.5-plotDim*.5);
    axisGraphics.lineTo(screen1Width + screen3Width*0.09, screen2Height + screen3Height*0.5-plotDim*.5);
    axisGraphics.moveTo(screen1Width + screen3Width*0.5+plotDim*.25, screen2Height + screen3Height*0.91);
    axisGraphics.lineTo(screen1Width + screen3Width*0.5+plotDim*.25, screen2Height + screen3Height*0.89);
    axisGraphics.moveTo(screen1Width + screen3Width*0.5-plotDim*.25, screen2Height + screen3Height*0.91);
    axisGraphics.lineTo(screen1Width + screen3Width*0.5-plotDim*.25, screen2Height + screen3Height*0.89);
    axisGraphics.moveTo(screen1Width + screen3Width*0.11, screen2Height + screen3Height*0.5+plotDim*.25);
    axisGraphics.lineTo(screen1Width + screen3Width*0.09, screen2Height + screen3Height*0.5+plotDim*.25);
    axisGraphics.moveTo(screen1Width + screen3Width*0.11, screen2Height + screen3Height*0.5-plotDim*.25);
    axisGraphics.lineTo(screen1Width + screen3Width*0.09, screen2Height + screen3Height*0.5-plotDim*.25);

    axisGraphics.moveTo(screen1Width + screen3Width*0.5+plotDim*.5, screen2Height + screen3Height*0.11);
    axisGraphics.lineTo(screen1Width + screen3Width*0.5+plotDim*.5, screen2Height + screen3Height*0.09);
    axisGraphics.moveTo(screen1Width + screen3Width*0.5-plotDim*.5, screen2Height + screen3Height*0.11);
    axisGraphics.lineTo(screen1Width + screen3Width*0.5-plotDim*.5, screen2Height + screen3Height*0.09);
    axisGraphics.moveTo(screen1Width + screen3Width*0.91, screen2Height + screen3Height*0.5+plotDim*.5);
    axisGraphics.lineTo(screen1Width + screen3Width*0.89, screen2Height + screen3Height*0.5+plotDim*.5);
    axisGraphics.moveTo(screen1Width + screen3Width*0.91, screen2Height + screen3Height*0.5-plotDim*.5);
    axisGraphics.lineTo(screen1Width + screen3Width*0.89, screen2Height + screen3Height*0.5-plotDim*.5);
    axisGraphics.moveTo(screen1Width + screen3Width*0.5+plotDim*.25, screen2Height + screen3Height*0.11);
    axisGraphics.lineTo(screen1Width + screen3Width*0.5+plotDim*.25, screen2Height + screen3Height*0.09);
    axisGraphics.moveTo(screen1Width + screen3Width*0.5-plotDim*.25, screen2Height + screen3Height*0.11);
    axisGraphics.lineTo(screen1Width + screen3Width*0.5-plotDim*.25, screen2Height + screen3Height*0.09);
    axisGraphics.moveTo(screen1Width + screen3Width*0.91, screen2Height + screen3Height*0.5+plotDim*.25);
    axisGraphics.lineTo(screen1Width + screen3Width*0.89, screen2Height + screen3Height*0.5+plotDim*.25);
    axisGraphics.moveTo(screen1Width + screen3Width*0.91, screen2Height + screen3Height*0.5-plotDim*.25);
    axisGraphics.lineTo(screen1Width + screen3Width*0.89, screen2Height + screen3Height*0.5-plotDim*.25);

    axisGraphics.moveTo(screen1Width + screen3Width*0.1, screen2Height + screen3Height*0.1);
    axisGraphics.lineTo(screen1Width + screen3Width*0.9, screen2Height + screen3Height*0.1);
    axisGraphics.lineTo(screen1Width + screen3Width*0.9, screen2Height + screen3Height*0.9);
    axisGraphics.lineTo(screen1Width + screen3Width*0.1, screen2Height + screen3Height*0.9);
    axisGraphics.lineTo(screen1Width + screen3Width*0.1, screen2Height + screen3Height*0.1);

    plotText1 = game.add.text(screen1Width + screen3Width*.92, screen2Height + screen3Height*0.52, 'Dim 1', {fontSize: '10px', fill: '0x000000'});
    plotText2 = game.add.text(screen1Width + screen3Width*.52, screen2Height + screen3Height*.95, 'Dim 2', {fontSize: '10px', fill: '0x000000'});

    plotText3 = game.add.text(screen1Width + screen3Width*.5+plotDim*0.49, screen2Height + screen3Height*0.92, '1', {fontSize: '10px', fill: '0x000000'});
    plotText4 = game.add.text(screen1Width + screen3Width*.5-plotDim*0.51, screen2Height + screen3Height*0.92, '-1', {fontSize: '10px', fill: '0x000000'});
    plotText5 = game.add.text(screen1Width + screen3Width*0.06, screen2Height + screen3Height*0.5+plotDim*0.475, '-1', {fontSize: '10px', fill: '0x000000'});
    plotText6 = game.add.text(screen1Width + screen3Width*0.06, screen2Height + screen3Height*0.5-plotDim*0.525, '1', {fontSize: '10px', fill: '0x000000'});

    plotText7 = game.add.text(screen1Width + screen3Width*.5+plotDim*0.23, screen2Height + screen3Height*0.92, '0.5', {fontSize: '10px', fill: '0x000000'});
    plotText8 = game.add.text(screen1Width + screen3Width*.5-plotDim*0.28, screen2Height + screen3Height*0.92, '-0.5', {fontSize: '10px', fill: '0x000000'});
    plotText9 = game.add.text(screen1Width + screen3Width*0.04, screen2Height + screen3Height*0.5+plotDim*0.235, '-0.5', {fontSize: '10px', fill: '0x000000'});
    plotText10 = game.add.text(screen1Width + screen3Width*0.04, screen2Height + screen3Height*0.5-plotDim*0.275, '0.5', {fontSize: '10px', fill: '0x000000'});

    plotText11 = game.add.text(screen1Width + screen3Width*.5+plotDim*0.48, screen2Height + screen3Height*0.12, '5', {fontSize: '10px', fill: '0x000000'});
    plotText12 = game.add.text(screen1Width + screen3Width*.5-plotDim*0.52, screen2Height + screen3Height*0.12, '-5', {fontSize: '10px', fill: '0x000000'});
    plotText13 = game.add.text(screen1Width + screen3Width*0.92, screen2Height + screen3Height*0.5+plotDim*0.475, '-5', {fontSize: '10px', fill: '0x000000'});
    plotText14 = game.add.text(screen1Width + screen3Width*0.92, screen2Height + screen3Height*0.5-plotDim*0.525, '5', {fontSize: '10px', fill: '0x000000'});

    plotText15 = game.add.text(screen1Width + screen3Width*.5+plotDim*0.23, screen2Height + screen3Height*0.12, '2.5', {fontSize: '10px', fill: '0x000000'});
    plotText16 = game.add.text(screen1Width + screen3Width*.5-plotDim*0.28, screen2Height + screen3Height*0.12, '-2.5', {fontSize: '10px', fill: '0x000000'});
    plotText17 = game.add.text(screen1Width + screen3Width*0.92, screen2Height + screen3Height*0.5+plotDim*0.235, '-2.5', {fontSize: '10px', fill: '0x000000'});
    plotText18 = game.add.text(screen1Width + screen3Width*0.92, screen2Height + screen3Height*0.5-plotDim*0.275, '2.5', {fontSize: '10px', fill: '0x000000'});

    plotText19 = game.add.text(screen1Width + screen3Width*.7,screen2Height + screen3Height*.03, 'PCA Factor Plot', {fontSize: '15px', fill: '0x000000'});

    pcaGraphics = game.add.graphics(0,0);
    points = game.add.graphics(0,0);
    pca0Text = null;

    circleGraphics.fixedToCamera = true;
    axisGraphics.fixedToCamera = true;
    plotText1.fixedToCamera = true;
    plotText2.fixedToCamera = true;
    plotText3.fixedToCamera = true;
    plotText4.fixedToCamera = true;
    plotText5.fixedToCamera = true;
    plotText6.fixedToCamera = true;
    plotText7.fixedToCamera = true;
    plotText8.fixedToCamera = true;
    plotText9.fixedToCamera = true;
    plotText10.fixedToCamera = true;
    plotText11.fixedToCamera = true;
    plotText12.fixedToCamera = true;
    plotText13.fixedToCamera = true;
    plotText14.fixedToCamera = true;
    plotText15.fixedToCamera = true;
    plotText16.fixedToCamera = true;
    plotText17.fixedToCamera = true;
    plotText18.fixedToCamera = true;
    plotText19.fixedToCamera = true;
    pcaGraphics.fixedToCamera = true;
    points.fixedToCamera = true;

    statGroup.add(sideCanvas);
    statGroup.add(rateText);
    statGroup.add(tpText);
    statGroup.add(fpText);
    statGroup.add(specText);
    statGroup.add(precText);
    statGroup.add(prevText);

    statGroup.add(circleGraphics);
    statGroup.add(axisGraphics);
    statGroup.add(plotText1);
    statGroup.add(plotText2);
    statGroup.add(plotText3);
    statGroup.add(plotText4);
    statGroup.add(plotText5);
    statGroup.add(plotText6);
    statGroup.add(plotText7);
    statGroup.add(plotText8);
    statGroup.add(plotText9);
    statGroup.add(plotText10);
    statGroup.add(plotText11);
    statGroup.add(plotText12);
    statGroup.add(plotText13);
    statGroup.add(plotText14);
    statGroup.add(plotText15);
    statGroup.add(plotText16);
    statGroup.add(plotText17);
    statGroup.add(plotText18);
    statGroup.add(plotText19);
    statGroup.add(pcaGraphics);
    statGroup.add(points);

    frontGroup.add(text);
    frontGroup.add(trainingText);
    frontGroup.add(levelProgress);
    frontGroup.add(squirrelProgress);
    frontGroup.add(downArrow);
    frontGroup.add(squirrel.squirrelSprite);
    frontGroup.add(terrain.hillGraphics);
    frontGroup.add(boostFill);
    frontGroup.add(boostMeter);
  },
  acornCollision : function(body1, body2, fixture1, fixture2, begin){
    if (!begin){
      return;
    };
    // console.log('Acorn Collision');
    body2.sprite.destroy();
    if (boostTimer < boostRecharge){
      boostTimer += acornRecharge;
      if (boostTimer > boostRecharge){
        boostTimer = boostRecharge;
      };
    };
    if (boostTimer == boostRecharge){
      boostAvail = true;
    };
  },
  update: function(){
    game.world.bringToTop(frontGroup);
    game.world.bringToTop(statGroup);

    squirrelX = squirrel.getPositionX();
    squirrelY = squirrel.getPositionY();

    zoom = Math.min(1, Math.pow((screen1Height-30)/(250-squirrelY),0.75));

    game.world.scale.setTo(zoom);
    //background.scale.setTo((1/zoom)*screen1Width/4608,(1/zoom)*screen1Height/2307);
    background.scale.setTo((1/zoom)*screen1Width/656,(1/zoom)*screen1Height/554);
    game.camera.x = squirrelX*zoom - 100;
    game.camera.y = -screen1Height/1.5 - screen1Height + screen1Height*zoom;

    s = Math.round((timerEvent.delay - timer.ms) / 1000);
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60)
    if (s == 0){
      // var data = Y;
      // var csvContent = "data:text/csv;charset=utf-8,";
      // data.forEach(function(infoArray, index){
      //    dataString = infoArray.join(",");
      //    csvContent += index < data.length ? dataString+ "\n" : dataString;
      // });
      // var encodedUri = encodeURI(csvContent);
      // var link = document.createElement("a");
      // link.setAttribute("href", encodedUri);
      // link.setAttribute("download", "SquirrelDataLevel2.csv");
      // link.click();

      squirrelProgress.destroy();
      game.state.start('levelFailed');
    };
    text.text = "Level: " + 2 + " Time Left: " + minutes.substr(-2) + ":" + seconds.substr(-2);

    sideCanvas.scale.setTo(1/zoom);
    rateText.scale.setTo(1/zoom);
    tpText.scale.setTo(1/zoom);
    fpText.scale.setTo(1/zoom);
    specText.scale.setTo(1/zoom);
    precText.scale.setTo(1/zoom);
    prevText.scale.setTo(1/zoom);

    circleGraphics.scale.setTo(1/zoom);
    axisGraphics.scale.setTo(1/zoom);
    plotText1.scale.setTo(1/zoom);
    plotText2.scale.setTo(1/zoom);
    plotText3.scale.setTo(1/zoom);
    plotText4.scale.setTo(1/zoom);
    plotText5.scale.setTo(1/zoom);
    plotText6.scale.setTo(1/zoom);
    plotText7.scale.setTo(1/zoom);
    plotText8.scale.setTo(1/zoom);
    plotText9.scale.setTo(1/zoom);
    plotText10.scale.setTo(1/zoom);
    plotText11.scale.setTo(1/zoom);
    plotText12.scale.setTo(1/zoom);
    plotText13.scale.setTo(1/zoom);
    plotText14.scale.setTo(1/zoom);
    plotText15.scale.setTo(1/zoom);
    plotText16.scale.setTo(1/zoom);
    plotText17.scale.setTo(1/zoom);
    plotText18.scale.setTo(1/zoom);
    plotText19.scale.setTo(1/zoom);
    pcaGraphics.scale.setTo(1/zoom);
    points.scale.setTo(1/zoom);

    if (pca0Text != null){
      pca0Text.scale.setTo(1/zoom);
      pca1Text.scale.setTo(1/zoom);
      pca2Text.scale.setTo(1/zoom);
      pca3Text.scale.setTo(1/zoom);
      pca4Text.scale.setTo(1/zoom);
      pca5Text.scale.setTo(1/zoom);
      pca6Text.scale.setTo(1/zoom);
      pca7Text.scale.setTo(1/zoom);
      pca8Text.scale.setTo(1/zoom);
      pca9Text.scale.setTo(1/zoom);
      pca10Text.scale.setTo(1/zoom);
      pca11Text.scale.setTo(1/zoom);
      pca12Text.scale.setTo(1/zoom);
      pca13Text.scale.setTo(1/zoom);
      pca14Text.scale.setTo(1/zoom);
      pca15Text.scale.setTo(1/zoom);
      pca16Text.scale.setTo(1/zoom);
      pca17Text.scale.setTo(1/zoom);
      pca18Text.scale.setTo(1/zoom);
      pca19Text.scale.setTo(1/zoom);
    };

    text.scale.setTo(1/zoom);
    trainingText.scale.setTo(1/zoom);
    levelProgress.scale.setTo(1/zoom);
    boostMeter.scale.setTo(1/zoom);

    boostFill.destroy();
    boostFill = game.add.graphics(0,0);
    boostFill.fixedToCamera = true;
    boostFill.lineStyle(1, 0xFF0000, 1);
    boostFill.beginFill(0xFF0000);
    boostFill.drawRect(screen1Width*0.80,screen1Height*0.1, screen1Width*0.1*boostTimer/boostRecharge,screen1Height*0.04);
    boostFill.endFill();
    boostFill.scale.setTo(1/zoom);


    if (boostTimer < boostRecharge){
      boostTimer += 1;
    }
    if (boostTimer == boostRecharge){
      boostAvail = true;
    }

    if ((training)&(boostCurr < boostLength)){
      squirrel.boost();
      isDiving = 2;
      boostCurr += 1;
    } else if (training){
      if (cursors.down.isDown) {
        squirrel.dive();
        isDiving = 1;
      } else if ((cursors.right.isDown)&(boostAvail) ) {
        squirrel.boost();
        isDiving = 2;
        boostTimer = 0;
        boostAvail = false;
        boostCurr = 0;
      } else {
        isDiving = 0;
      };
    } else if (boostCurr < boostLength){
      currFeatures = player.stateToFeatures();
      isDiving = 2;
      squirrel.boost();
      boostCurr += 1;
    } else{
      currFeatures = player.stateToFeatures();
      isDiving = machine.classify(currFeatures);
      if ((isDiving == 2)&(boostAvail)){
        squirrel.boost();
        boostTimer = 0;
        boostAvail = false;
        boostCurr = 0;
      } else if(isDiving == 1){
        squirrel.dive();
      }
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
    squirrelProgress.drawCircle(.1*screen1Width + .8*screen1Width*squirrelX/level2Length, .05*screen1Height, 20);
    squirrelProgress.endFill();
    squirrelProgress.scale.setTo(1/zoom);

    if (squirrelX > level2Length){
      // var data = Y;
      // var csvContent = "data:text/csv;charset=utf-8,";
      // data.forEach(function(infoArray, index){
      //    dataString = infoArray.join(",");
      //    csvContent += index < data.length ? dataString+ "\n" : dataString;
      // });
      // var encodedUri = encodeURI(csvContent);
      // var link = document.createElement("a");
      // link.setAttribute("href", encodedUri);
      // link.setAttribute("download", "SquirrelDataLevel2.csv");
      // link.click();

      //console.log(machine.training.length);

      squirrelProgress.destroy();
      if (training){
        game.state.start('level2Complete');
      } else{
        game.state.start('autoLevelComplete');
      };
    };

    terrain.updateKnots(squirrelX/PTM);

    squirrel.updatePosition();

    if (training){
      currFeatures = player.stateToFeatures();
      machine.learn(currFeatures, isDiving);
      predict = machine.classify(currFeatures);
      X.push(currFeatures);
      currData = [];
      currData.push(isDiving);
      currData.push(currFeatures);
      Y.push(currData);
      totalFrames  += 1;
      if (isDiving == 1){
        actualYes += 1;
      } else{
        actualNo += 1;
      }
      if (predict != 0){
        predictYes += 1;
      }
      if (predict == isDiving){
        numCorrect += 1;
        if (isDiving == 0){
          trueNegative += 1;
        } else{
          truePositive += 1;
        }
      }else{
        if(isDiving == 0){
          falsePositive += 1;
        } else{
          falseNegative += 1;
        }
      }
      missRate = 1 - numCorrect/totalFrames;
      tpRate = truePositive/actualYes;
      fpRate = falsePositive/actualNo;
      specificity = 1 - fpRate;
      precision = truePositive/predictYes;
      prevalence = actualYes/totalFrames;

      counter += 1;

      if (counter % 100 == 0){
        mr = missRate.toFixed(3);
        tp = tpRate.toFixed(3);
        fp = fpRate.toFixed(3);
        spec = specificity.toFixed(3);
        prec = precision.toFixed(3);
        prev = prevalence.toFixed(3);
        rateText.text = 'Misclassification Rate: '+ mr;
        tpText.text = 'True Positive Rate: ' + tp;
        fpText.text = 'False Positive Rate: ' + fp;
        specText.text = 'Specificity: ' + spec;
        precText.text = 'Precision: ' + prec;
        prevText.text = 'Prevalence: ' + prev;
      };

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
          pca13Text.destroy();
          pca14Text.destroy();
          pca15Text.destroy();
          pca16Text.destroy();
          pca17Text.destroy();
          pca18Text.destroy();
          pca19Text.destroy();
        };

        points = game.add.graphics(0,0);
        points.beginFill(0xff0000);
        points.lineStyle(2, 0xff0000 , 1);

        pc = pca(X);
        pc2 = pcaReduce(pc, 2);
        col0 = pc2.map(function(value,index) { return value[0]; });
        col1 = pc2.map(function(value,index) { return value[1]; });
        dim0 = numeric.dot(col0, currFeatures);
        dim1 = numeric.dot(col1, currFeatures);
        points.drawCircle(screen1Width + screen3Width*0.5 + dim0*plotDim/(5*2), screen2Height + screen3Height*0.5 - dim1*plotDim/(5*2), 2);
        points.endFill();

        neighbors = machine.nearest(currFeatures);
        for (i = 0; i < neighbors.length; i++){
            dim0 = numeric.dot(col0, neighbors[i].v);
            dim1 = numeric.dot(col1, neighbors[i].v);
            dive = neighbors[i].lab;
            if (dive==0){
              points.beginFill(0x00ff00);
              points.lineStyle(2, 0x00ff00 , 1);
              points.drawCircle(screen1Width + screen3Width*0.5 + dim0*plotDim/(5*2), screen2Height + screen3Height*0.5 - dim1*plotDim/(5*2), 2);
              points.endFill();
            } else{
              points.beginFill(0x551a8b);
              points.lineStyle(2, 0x551a8b , 1);
              points.drawCircle(screen1Width + screen3Width*0.5 + dim0*plotDim/(5*2), screen2Height + screen3Height*0.5 - dim1*plotDim/(5*2), 2);
              points.endFill();
            };
        };


        pcaGraphics = game.add.graphics(0,0);
        pcaGraphics.beginFill(0x0000ff);
        pcaGraphics.lineStyle(2, 0x0000ff , 1);
        for (i = 0; i < pc2.length; i++){
          pcaGraphics.moveTo(screen1Width + screen3Width*0.5, screen2Height + screen3Height*0.5);
          pcaGraphics.lineTo(screen1Width + pc2[i][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[i][1]*plotDim/2 + screen3Height*0.5);
        }
        pca0Text = game.add.text(screen1Width + pc2[0][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[0][1]*plotDim/2 + screen3Height*0.5, covarNames[0],{fontSize: '10px', fill: '0x000000'});
        pca1Text = game.add.text(screen1Width + pc2[1][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[1][1]*plotDim/2 + screen3Height*0.5, covarNames[1],{fontSize: '10px', fill: '0x000000'});
        pca2Text = game.add.text(screen1Width + pc2[2][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[2][1]*plotDim/2 + screen3Height*0.5, covarNames[2],{fontSize: '10px', fill: '0x000000'});
        pca3Text = game.add.text(screen1Width + pc2[3][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[3][1]*plotDim/2 + screen3Height*0.5, covarNames[3],{fontSize: '10px', fill: '0x000000'});
        pca4Text = game.add.text(screen1Width + pc2[4][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[4][1]*plotDim/2 + screen3Height*0.5, covarNames[4],{fontSize: '10px', fill: '0x000000'});
        pca5Text = game.add.text(screen1Width + pc2[5][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[5][1]*plotDim/2 + screen3Height*0.5, covarNames[5],{fontSize: '10px', fill: '0x000000'});
        pca6Text = game.add.text(screen1Width + pc2[6][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[6][1]*plotDim/2 + screen3Height*0.5, covarNames[6],{fontSize: '10px', fill: '0x000000'});
        pca7Text = game.add.text(screen1Width + pc2[7][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[7][1]*plotDim/2 + screen3Height*0.5, covarNames[7],{fontSize: '10px', fill: '0x000000'});
        pca8Text = game.add.text(screen1Width + pc2[8][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[8][1]*plotDim/2 + screen3Height*0.5, covarNames[8],{fontSize: '10px', fill: '0x000000'});
        pca9Text = game.add.text(screen1Width + pc2[9][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[9][1]*plotDim/2 + screen3Height*0.5, covarNames[9],{fontSize: '10px', fill: '0x000000'});
        pca10Text = game.add.text(screen1Width + pc2[10][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[10][1]*plotDim/2 + screen3Height*0.5, covarNames[10],{fontSize: '10px', fill: '0x000000'});
        pca11Text = game.add.text(screen1Width + pc2[11][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[11][1]*plotDim/2 + screen3Height*0.5, covarNames[11],{fontSize: '10px', fill: '0x000000'});
        pca12Text = game.add.text(screen1Width + pc2[12][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[12][1]*plotDim/2 + screen3Height*0.5, covarNames[12],{fontSize: '10px', fill: '0x000000'});
        pca13Text = game.add.text(screen1Width + pc2[13][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[13][1]*plotDim/2 + screen3Height*0.5, covarNames[13],{fontSize: '10px', fill: '0x000000'});
        pca14Text = game.add.text(screen1Width + pc2[14][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[14][1]*plotDim/2 + screen3Height*0.5, covarNames[14],{fontSize: '10px', fill: '0x000000'});
        pca15Text = game.add.text(screen1Width + pc2[15][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[15][1]*plotDim/2 + screen3Height*0.5, covarNames[15],{fontSize: '10px', fill: '0x000000'});
        pca16Text = game.add.text(screen1Width + pc2[16][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[16][1]*plotDim/2 + screen3Height*0.5, covarNames[16],{fontSize: '10px', fill: '0x000000'});
        pca17Text = game.add.text(screen1Width + pc2[17][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[17][1]*plotDim/2 + screen3Height*0.5, covarNames[17],{fontSize: '10px', fill: '0x000000'});
        pca18Text = game.add.text(screen1Width + pc2[18][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[18][1]*plotDim/2 + screen3Height*0.5, covarNames[18],{fontSize: '10px', fill: '0x000000'});
        pca19Text = game.add.text(screen1Width + pc2[19][0]*plotDim/2 + screen3Width*0.5, screen2Height - pc2[19][1]*plotDim/2 + screen3Height*0.5, covarNames[19],{fontSize: '10px', fill: '0x000000'});
        pcaGraphics.endFill();

        pcaGraphics.fixedToCamera = true;
        points.fixedToCamera = true;
        pca0Text.fixedToCamera = true;
        pca1Text.fixedToCamera = true;
        pca2Text.fixedToCamera = true;
        pca3Text.fixedToCamera = true;
        pca4Text.fixedToCamera = true;
        pca5Text.fixedToCamera = true;
        pca6Text.fixedToCamera = true;
        pca7Text.fixedToCamera = true;
        pca8Text.fixedToCamera = true;
        pca9Text.fixedToCamera = true;
        pca10Text.fixedToCamera = true;
        pca11Text.fixedToCamera = true;
        pca12Text.fixedToCamera = true;
        pca13Text.fixedToCamera = true;
        pca14Text.fixedToCamera = true;
        pca15Text.fixedToCamera = true;
        pca16Text.fixedToCamera = true;
        pca17Text.fixedToCamera = true;
        pca18Text.fixedToCamera = true;
        pca19Text.fixedToCamera = true;


        statGroup.add(pcaGraphics);
        statGroup.add(points);
        statGroup.add(pca0Text);
        statGroup.add(pca1Text);
        statGroup.add(pca2Text);
        statGroup.add(pca3Text);
        statGroup.add(pca4Text);
        statGroup.add(pca5Text);
        statGroup.add(pca6Text);
        statGroup.add(pca7Text);
        statGroup.add(pca8Text);
        statGroup.add(pca9Text);
        statGroup.add(pca10Text);
        statGroup.add(pca11Text);
        statGroup.add(pca12Text);
        statGroup.add(pca13Text);
        statGroup.add(pca14Text);
        statGroup.add(pca15Text);
        statGroup.add(pca16Text);
        statGroup.add(pca17Text);
        statGroup.add(pca18Text);
        statGroup.add(pca19Text);
      };
    };

    //game.camera.focusOnXY(squirrel._body.x + 300.0, squirrel._body.y);
  },
  render: function(){
    //game.debug.box2dWorld();
    //game.debug.cameraInfo(game.camera, 32, 32);
  }
};


function chngEvalStatus(){
  if (training){
    training = false;
    trainingText.text = 'Evaluating';
  } else{
    training = true;
    trainingText.text = 'Training';
  };
};
