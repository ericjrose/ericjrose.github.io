var startX = 100.0;
var startY = 10.0;
// var gravity = 150.0; //250
var restitution = 0;
var PTM = 15.0; // conversion ratio
var cursors;
var background;
var squirrelSprite;
var squirrel;
var terrain;
var player;
var features;
var text;
var isPaused = false;

var downArrow;

var timer;
var timerEvent;

var level;
var tutorialLength = 15000; //25000
var timeRemaining = 90.0;

var tutorialCount = 0;

var machine = null;
var isDiving = 0;
var k = 5;

var training = true;
var trainingText;
var tutorialText;

var counter = 1;
var X = [];
var Y = [];
var numPrinPoints = 50;

var covarNames;
var neighbors;
var predict;
var totalFrames = 0;
var actualYes = 0;
var actualNo = 0;
var predictYes = 0;
var numCorrect = 0;
var truePositive = 0;
var trueNegative = 0;
var falsePositive = 0;
var falseNegative = 0;
var missRate;
var tpRate;
var fpRate;
var specificity;
var precision;
var prevalence;

var Tutorial = {
  preload: function(){
    //game.load.image('Forest','imgs/Flying Squirrel Forest L1.png');
    game.load.image('Forest','imgs/Flying Squirrel Forest Cropped 72ppi.gif');
    game.load.image('Squirrel', 'imgs/Squirrel Cape 01.png');
    game.load.image('Arrow', 'imgs/downArrow.png');

  },
  create: function(){
    game.time.advancedTiming = true;
    game.stage.backgroundColor = '#000000';
    level = 1;

    //background = game.add.tileSprite(0, 0, 4608, 2307,'Forest'); //Image is 4808x2307
    //background.scale.setTo(screen1Width/4608,screen1Height/2307);
    background = game.add.tileSprite(0, 0, 656, 554,'Forest'); //Image is 656x554
    background.scale.setTo(screen1Width/656,screen1Height/554);
    background.fixedToCamera = true;


    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.gravity.y = gravity;
    game.physics.box2d.restitution = restitution;
    //game.physics.box2d.setBoundsToWorld();

    squirrel = new Squirrel(game, 'Squirrel');
    terrain = new Terrain(game, 1, 1, 1);
    player = new Player(game, squirrel, terrain, level);
    machine = new kNear(k);

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
    keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
    keyP.onDown.add(pause, this);

    timer = game.time.create();
    //timerEvent = timer.add(Phaser.Timer.MINUTE*1 + Phaser.Timer.SECOND*30,this.endTimer,this);
    timerEvent = timer.add(Phaser.Timer.MINUTE*2 + Phaser.Timer.SECOND*0);
    timer.start();

    downArrow = game.add.sprite(screen1Width*.925,screen1Height*0.08, 'Arrow');
    downArrow.scale.setTo(24/786,30/1024);
    downArrow.fixedToCamera = true;

    // landingPoint = game.add.graphics(0,0);
    // landingPoint.fixedToCamera =  true;
    //
    // squirrelPath = game.add.graphics(0,0);
    // squirrelPath.fixedToCamera = true;

    initMessage = false;
    diveMessage = false;
    releaseMessage = false;
  },
  update: function(){
    tutorialCount += 1;
    prevDiving = isDiving;

    squirrelX = squirrel.getPositionX();
    squirrelY = squirrel.getPositionY();

    zoom = Math.min(1, Math.pow((screen1Height-30)/(250-squirrelY),0.75));

    if (tutorialCount == 2){
      tutorialText = game.add.text(screen1Width*.08, screen1Height*.35, 'Press the down arrow to dive which applies a downward force to the squirrel.', {fontSize: '20px', fill: '0x000000'});
      tutorialText2 = game.add.text(screen1Width*.08, screen1Height*.4, 'The goal is to dive so that you land on the downward sloping part of the hill.', {fontSize: '20px', fill: '0x000000'});
      tutorialText3 = game.add.text(screen1Width*.08, screen1Height*.45, 'You then want to release the dive button at the bottom of the hill.', {fontSize: '20px', fill: '0x000000'});
      tutorialText4 = game.add.text(screen1Width*.08, screen1Height*.5, 'This will allow your momentum to cause you to fly off the upward part of the hill.', {fontSize: '20px', fill: '0x000000'});
      tutorialText5 = game.add.text(screen1Width*.08, screen1Height*.55, 'Press P to pause the game at any time.', {fontSize: '20px', fill: '0x000000'});
      tutorialText.fixedToCamera = true;
      tutorialText2.fixedToCamera = true;
      tutorialText3.fixedToCamera = true;
      tutorialText4.fixedToCamera = true;
      tutorialText5.fixedToCamera = true;
      tutorialText.scale.setTo(1/zoom);
      tutorialText2.scale.setTo(1/zoom);
      tutorialText3.scale.setTo(1/zoom);
      tutorialText4.scale.setTo(1/zoom);
      tutorialText5.scale.setTo(1/zoom);
      pause();
      setTimeout(resumeTutorial, 10000);
      initMessage = true;
    };

    if (tutorialCount == 400){
      tutorialText = game.add.text(screen1Width*.08, screen1Height*.35, 'The bar across the top of the screen shows your progess in each level.', {fontSize: '20px', fill: '0x000000'});
      tutorialText2 = game.add.text(screen1Width*.08, screen1Height*.4, 'You need to finish the level before the timer runs out to complete the level.', {fontSize: '20px', fill: '0x000000'});
      tutorialText.fixedToCamera = true;
      tutorialText2.fixedToCamera = true;
      tutorialText.scale.setTo(1/zoom);
      tutorialText2.scale.setTo(1/zoom);
      pause();
      setTimeout(resumeTutorial, 10000);
    };

    if (tutorialCount == 800){
      tutorialText = game.add.text(screen1Width*.08, screen1Height*.35, 'As you play data is collected on the current state of the game', {fontSize: '20px', fill: '0x000000'});
      tutorialText2 = game.add.text(screen1Width*.08, screen1Height*.4, 'and on if you are diving.', {fontSize: '20px', fill: '0x000000'});
      tutorialText3 = game.add.text(screen1Width*.08, screen1Height*.45, 'A computer player is then learning how to play by using imitation learning.', {fontSize: '20px', fill: '0x000000'});
      tutorialText4 = game.add.text(screen1Width*.08, screen1Height*.5, 'Press E at any time to switch between you playing', {fontSize: '20px', fill: '0x000000'});
      tutorialText5 = game.add.text(screen1Width*.08, screen1Height*.55, 'and watching the computer player based on the data collected on you.', {fontSize: '20px', fill: '0x000000'});
      tutorialText.fixedToCamera = true;
      tutorialText2.fixedToCamera = true;
      tutorialText3.fixedToCamera = true;
      tutorialText4.fixedToCamera = true;
      tutorialText5.fixedToCamera = true;
      tutorialText.scale.setTo(1/zoom);
      tutorialText2.scale.setTo(1/zoom);
      tutorialText3.scale.setTo(1/zoom);
      tutorialText4.scale.setTo(1/zoom);
      tutorialText5.scale.setTo(1/zoom);
      pause();
      setTimeout(resumeTutorial, 10000);
    };

    if (tutorialCount == 1200){
      tutorialText = game.add.text(screen1Width*.08, screen1Height*.35, 'The top right screen shows different statistics', {fontSize: '20px', fill: '0x000000'});
      tutorialText2 = game.add.text(screen1Width*.08, screen1Height*.4, 'measuring the effectiveness of the computer player.', {fontSize: '20px', fill: '0x000000'});
      tutorialText3 = game.add.text(screen1Width*.08, screen1Height*.45, 'The bottom right shows a plot of the first two principal components', {fontSize: '20px', fill: '0x000000'});
      tutorialText4 = game.add.text(screen1Width*.08, screen1Height*.5, 'of the features being collected as you play.', {fontSize: '20px', fill: '0x000000'});
      tutorialText.fixedToCamera = true;
      tutorialText2.fixedToCamera = true;
      tutorialText3.fixedToCamera = true;
      tutorialText4.fixedToCamera = true;
      tutorialText.scale.setTo(1/zoom);
      tutorialText2.scale.setTo(1/zoom);
      tutorialText3.scale.setTo(1/zoom);
      tutorialText4.scale.setTo(1/zoom);
      pause();
      setTimeout(resumeTutorial, 10000);
    };
    if (tutorialCount == 1201){
      tutorialText = game.add.text(screen1Width*.08, screen1Height*.35, 'The red dot on the plot represents the current state of the game.', {fontSize: '20px', fill: '0x000000'});
      tutorialText2 = game.add.text(screen1Width*.08, screen1Height*.4, 'The other dots represent the five most similar previous states.', {fontSize: '20px', fill: '0x000000'});
      tutorialText3 = game.add.text(screen1Width*.08, screen1Height*.45, 'These dots are green if you did nothing or purple if you chose to dive.', {fontSize: '20px', fill: '0x000000'});
      tutorialText4 = game.add.text(screen1Width*.08, screen1Height*.5, 'The computer player then chooses the action that was chosen', {fontSize: '20px', fill: '0x000000'});
      tutorialText5 = game.add.text(screen1Width*.08, screen1Height*.55, 'by the majority of the five points.', {fontSize: '20px', fill: '0x000000'});
      tutorialText.fixedToCamera = true;
      tutorialText2.fixedToCamera = true;
      tutorialText3.fixedToCamera = true;
      tutorialText4.fixedToCamera = true;
      tutorialText5.fixedToCamera = true;
      tutorialText.scale.setTo(1/zoom);
      tutorialText2.scale.setTo(1/zoom);
      tutorialText3.scale.setTo(1/zoom);
      tutorialText4.scale.setTo(1/zoom);
      tutorialText5.scale.setTo(1/zoom);
      pause();
      setTimeout(resumeTutorial, 10000);
    };

    game.world.scale.setTo(zoom);
    //background.scale.setTo((1/zoom)*screen1Width/4608,(1/zoom)*screen1Height/2307);
    background.scale.setTo((1/zoom)*screen1Width/656,(1/zoom)*screen1Height/554);
    game.camera.x = squirrelX*zoom - 100;
    //game.camera.y = -screen1Height/2 - screen1Height + screen1Height*zoom;
    game.camera.y = -screen1Height/1.5 - screen1Height + screen1Height*zoom;

    s = Math.round((timerEvent.delay - timer.ms) / 1000);
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    if (s == 0){
      squirrelProgress.destroy();
      game.state.start('levelFailed');
      game2.state.start('levelFailed');
      game3.state.start('levelFailed');
    };
    text.text = "Tutorial" + " Time Left: " + minutes.substr(-2) + ":" + seconds.substr(-2);

    text.scale.setTo(1/zoom);
    trainingText.scale.setTo(1/zoom);
    levelProgress.scale.setTo(1/zoom);

    hillY = terrain.hillFn.at((squirrelX+300)/PTM);

    // Adjusted for radius of squirrel
    if (squirrelY/PTM   < hillY - 2){
      grounded = 0;
    } else{
      grounded = 1;
    };

    squirDeriv = terrain.hillFn.diff().at((squirrelX+300)/PTM);
    // console.log('Squirrel X: ' + squirrelX);
    // console.log('Squirrel Y: ' + squirrelY);
    // console.log('Grounded: ' + grounded);
    // console.log('Hill Y: ' + hillY);
    // console.log('Deriv: ' + squirDeriv);

    velY = squirrel.getVelocityY(); //  /PTM?
    velX = squirrel.getVelocityX();

    // console.log('Vel X: ' + velX);
    // console.log('Vel Y: ' + velY);

    // console.log('Vel Y: ' + velY);

    // landingPoint.destroy();
    // squirrelPath.destroy();
    if (grounded){
      //squirDeriv = terrain.hillFn.diff().at((squirrelX+300)/PTM);
      if (squirDeriv > 0){
        isDiving = 1;
      } else{
        isDiving = 0;
      };
    } else{
      if (isDiving == 1){
        isDiving = 1;
      } else if ((velY > 0)&(isDiving == 0)){
        // bisect = bisect_left(terrain.knotsX, (squirrelX+300)/PTM, 0, terrain.knotsX.length);
        // heightKnot1 = terrain.knotsY[bisect];
        // heightKnot2 = terrain.knotsY[bisect + 1];

        // console.log('Squirrel Y: ' + squirrelY/PTM);
        // console.log('Hill Y: ' + hillY);
        // if ((squirDeriv > 0)&(squirrelY/PTM + 20 > hillY)){
        //   console.log('Dive');
        //   isDiving = 1;
        // } else {
        //   isDiving = 0;
        // };


        futureSquirrelY = [squirrelY];
        futureSquirrelX = [squirrelX];
        futureHillY = futureSquirrelY/PTM + 10;
        t = 0
        // squirrelPath = game.add.graphics(0,0);
        // squirrelPath.fixedToCamera = true;
        // squirrelPath.lineStyle(2, 0xff0000 , 1);
        // squirrelPath.beginFill(0xff0000);

        while(futureSquirrelY[futureSquirrelY.length-1]/PTM < futureHillY){
          t += .05;
          //console.log(t);
          futureSquirrelX.push(0.5*2*PTM*Math.pow(t,2) + velX*t + squirrelX);
          futureSquirrelY.push(0.5*(8*400)*Math.pow(t,2) + velY*t + squirrelY); ///(Math.PI*Math.pow(.8,2))
          //squirrelPath.drawCircle(futureSquirrelX[futureSquirrelX.length-1] - game.camera.x, futureSquirrelY[futureSquirrelY.length-1] - game.camera.y, 8);
          futureHillY = terrain.hillFn.at((futureSquirrelX[futureSquirrelX.length-1]+300)/PTM);
          if (t > 500){
            landingDeriv = -1;
            break;
          };
        };
        //squirrelPath.endFill(0xff0000);
        sqFn = numeric.spline(futureSquirrelX, futureSquirrelY);

        minIntX = futureSquirrelX[0];
        maxIntX = futureSquirrelX[futureSquirrelX.length-1];
        midIntX = (minIntX+maxIntX)/2;
        sqMidY = sqFn.at(midIntX)/PTM;
        hillMidY = terrain.hillFn.at((midIntX+300)/PTM);
        while (Math.abs(sqMidY - hillMidY) > 0.001){
          //console.log('IN WHILE LOOP');
          if (sqMidY > hillMidY){
            maxIntX = midIntX;
          } else{
            minIntX = midIntX;
          };
          midIntX = (minIntX+maxIntX)/2;
          sqMidY = sqFn.at(midIntX)/PTM;
          hillMidY = terrain.hillFn.at((midIntX+300)/PTM);
        };

        landingDeriv = terrain.hillFn.diff().at((midIntX+300)/PTM);
        // console.log('Current X: ' + squirrelX);
        // console.log('Current Y: ' + squirrelY);
        // console.log('Current X Vel: ' + velX);
        // console.log('Current Y Vel: ' + velY);
        // console.log('Future Sq X: ' + futureSquirrelX);
        // console.log('Future Sq Y: ' + futureSquirrelY);
        // console.log('Landing X: ' + midIntX);
        // console.log('Landing Y: ' + hillMidY);
        // console.log('LandingDeriv: ' + landingDeriv);

        landScreenX = midIntX - game.camera.x;
        landScreenY = hillMidY - game.camera.y;
        // console.log('Screen X: ' + landScreenX);
        // console.log('Screen Y: ' + landScreenY);

        // landingPoint = game.add.graphics(0,0);
        // landingPoint.fixedToCamera = true;
        // landingPoint.lineStyle(2, 0xff0000 , 1);
        // landingPoint.beginFill(0xff0000);
        // landingPoint.drawCircle(landScreenX, landScreenY, 10);
        // landingPoint.endFill(0xff0000);

        if (landingDeriv > 0.5){
          isDiving = 1; //Should be 1
        } else{
          isDiving = 0;
        };

        } else{
        isDiving = 0;
      };
    };

    if (isDiving == 1){
      squirrel.dive();
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
    squirrelProgress.drawCircle(.1*screen1Width + .8*screen1Width*squirrelX/tutorialLength, .05*screen1Height, 20);
    squirrelProgress.endFill();
    squirrelProgress.scale.setTo(1/zoom);

    if (squirrelX > tutorialLength){
      squirrelProgress.destroy();
      game.state.start('tutorialComplete');
      game2.state.start('tutorialComplete');
      game3.state.start('tutorialComplete');
    };

    terrain.updateKnots(squirrelX/PTM);
    squirrel.updatePosition();

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

    if ((prevDiving == 0)&(isDiving == 1)&(initMessage)&(!diveMessage)){
      tutorialText = game.add.text(screen1Width*.08, screen1Height*.35, 'Start diving so you land on the hill.', {fontSize: '20px', fill: '0x000000'});
      tutorialText.fixedToCamera = true;
      pause();
      diveMessage = true;
      setTimeout(resumeTutorial, 3000);
    };

    if ((prevDiving == 1)&(isDiving == 0)&(initMessage)&(!releaseMessage)&(diveMessage)){
      tutorialText = game.add.text(screen1Width*.08, screen1Height*.35, 'Then release right before the uphill.', {fontSize: '20px', fill: '0x000000'});
      tutorialText.fixedToCamera = true;
      pause();
      releaseMessage = true;
      setTimeout(resumeTutorial, 3000);
    };

    //game.camera.focusOnXY(squirrel._body.x + 300.0, squirrel._body.y);
  },
  render: function(){
    // game.debug.box2dWorld();
    // game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.text(game.time.fps,2,14,'#00ff00')
  }
};

var Tutorial_2 = {
  preload: function(){
  },
  create: function(){
    game2.stage.backgroundColor = '#ffffff';
    rateText = game2.add.text(screen2Width*0.1, screen2Height*0.1, 'Misclassification Rate:', {fontSize: '14px', fill: '0xffffff'});
    tpText = game2.add.text(screen2Width*0.1, screen2Height*0.2, 'True Positive Rate:', {fontSize: '14px', fill: '0xffffff'});
    fpText = game2.add.text(screen2Width*0.1, screen2Height*0.3, 'False Positive Rate:', {fontSize: '14px', fill: '0xffffff'});
    specText = game2.add.text(screen2Width*0.1, screen2Height*0.4, 'Specificity:', {fontSize: '14px', fill: '0xffffff'});
    precText = game2.add.text(screen2Width*0.1, screen2Height*0.5, 'Precision:', {fontSize: '14px', fill: '0xffffff'});
    prevText = game2.add.text(screen2Width*0.1, screen2Height*0.6, 'Prevalence:', {fontSize: '14px', fill: '0xffffff'});
  },
  update: function(){
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
    }
    //game2.camera.x = squirrel2X - 100;
    //game.camera.focusOnXY(squirrel._body.x + 300.0, squirrel._body.y);
  },
  render: function(){
    //game2.debug.box2dWorld();
    //game2.debug.cameraInfo(game2.camera, 32, 32);
  }
};

var Tutorial_3 = {
  preload: function(){
    covarNames = ["Grounded","X Vel","Y Vel","Vel","Sq Angle","Deriv 1","Ang to Knot 1","Deriv 2","Ang to Knot 2","Deriv 3","Ang to Knot 3","Dist to Valley","Dist to Apex","No Snakes","Dist to Snake","Chng X Dive"];
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

    plotText = game3.add.text(screen3Width*.5+plotDim*0.48, screen3Height*0.12, '5', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*.5-plotDim*0.52, screen3Height*0.12, '-5', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.92, screen3Height*0.5+plotDim*0.475, '-5', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.92, screen3Height*0.5-plotDim*0.525, '5', {fontSize: '10px', fill: '0x000000'});

    plotText = game3.add.text(screen3Width*.5+plotDim*0.23, screen3Height*0.12, '2.5', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*.5-plotDim*0.28, screen3Height*0.12, '-2.5', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.92, screen3Height*0.5+plotDim*0.235, '-2.5', {fontSize: '10px', fill: '0x000000'});
    plotText = game3.add.text(screen3Width*0.92, screen3Height*0.5-plotDim*0.275, '2.5', {fontSize: '10px', fill: '0x000000'});

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
      dim0 = numeric.dot(col0, currFeatures);
      dim1 = numeric.dot(col1, currFeatures);
      //console.log(currFeatures);
      //console.log([dim0,dim1]);
      points.drawCircle(screen3Width*0.5 + dim0*plotDim/(5*2), screen3Height*0.5 - dim1*plotDim/(5*2), 2);
      points.endFill();

      neighbors = machine.nearest(currFeatures);
      //console.log(neighbors);
      //console.log(neighbors.length);
      for (i = 0; i < neighbors.length; i++){
          dim0 = numeric.dot(col0, neighbors[i].v);
          dim1 = numeric.dot(col1, neighbors[i].v);
          dive = neighbors[i].lab;
          //console.log(dive);
          //console.log([dim0,dim1]);
          if (dive==0){
            points.beginFill(0x00ff00);
            points.lineStyle(2, 0x00ff00 , 1);
            points.drawCircle(screen3Width*0.5 + dim0*plotDim/(5*2), screen3Height*0.5 - dim1*plotDim/(5*2), 2);
            points.endFill();
          } else{
            points.beginFill(0x551a8b);
            points.lineStyle(2, 0x551a8b , 1);
            points.drawCircle(screen3Width*0.5 + dim0*plotDim/(5*2), screen3Height*0.5 - dim1*plotDim/(5*2), 2);
            points.endFill();
          };
          //console.log([dim0,dim1]);
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

function pause(){
  if (isPaused){
    isPaused = false;
    game.paused = false;
    game2.paused = false;
    game3.paused = false;
  } else{
    isPaused = true;
    game.paused = true;
    game2.paused = true;
    game3.paused = true;
  }
}

function resumeTutorial(){
    isPaused = false;
    game.paused = false;
    game2.paused = false;
    game3.paused = false;
    tutorialText.destroy();
    tutorialText2.destroy();
    tutorialText3.destroy();
    tutorialText4.destroy();
    tutorialText5.destroy();
    tutorialText6.destroy();
}
