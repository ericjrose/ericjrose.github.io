var startX = 100.0;
var startY = 10.0;
var restitution = 0;
var PTM = 15.0; // conversion ratio
var cursors;
var squirrelSprite;
var squirrel;
var terrain;
var player;
var features;
var text;
var isPaused = false;
var isMuted = false;

var downArrow;

var timer;
var timerEvent;

var level;
var levelLength = 30000; //25000
var timeRemaining = 90.0;

var machine = null;
var isDiving = 0;
var k = 5;

var training = true;
var trainingText;

var counter = 1;
var X = [];
var Y = [];
var numPrinPoints = 50;
var prevDataLength = 0;

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

var numLevels = 1000;
var colorTheme = [];
var treeType = [];
var skyType = [];
var starInd = [];
var groundType = [];
var groundImgType = [];
var groundY1 = [];
var groundY2 = [];
var groundY3 = [];
var groundY = [];
var groundX = [];
var treeY = [];
var treeY2 = [];
var treeY3 = [];
var treeX = [];
var treeX2 = [];
var treeX3 = [];
var skyX = [];
var skyY = [];
var starX = [];
var starY = [];
var starScale = [];

var music;
var liftSound;
var boostSound;
var acornSound;
var snakeSound;

var covarNames = ["Grounded","X Vel","Y Vel","Vel","Sq Angle","Deriv 1","Ang to Knot 1","Deriv 2","Ang to Knot 2","Deriv 3","Ang to Knot 3","Dist to Valley","Dist to Apex","No Snakes","Dist to Snake","Ang to Snake","No Acorns","Dist to Acorn","Ang to Acorn","Chng X Dive"];

{ // create pca webworker
  window.pcaWorker = new Worker('src/pca-webworker.js');

  window.pComp = null;

  window.pcaWorker.onmessage = function (e) {
    window.pComp = e.data;
  };

  window.sendPcaData = function sendPcaData(featureRow) {
    window.pcaWorker.postMessage({
      type: 'data',
      data: featureRow
    });
  };

  window.sendPcaTrim = function sendPcaTrim() {
    window.pcaWorker.postMessage({
      type: 'reset'
    });
  };
}

var Level1 = {
  preload: function(){
    game.load.image('Squirrel', 'imgs/cape.png');
    game.load.image('Arrow', 'imgs/downArrow.png');

    game.load.image('Cloud1_C1', 'imgs/cloud1_C1.png');
    game.load.image('Cloud2_C1', 'imgs/cloud2_C1.png');
    game.load.image('Cloud3_C1', 'imgs/cloud3_C1.png');
    game.load.image('Cloud1_C2', 'imgs/cloud1_C2.png');
    game.load.image('Cloud2_C2', 'imgs/cloud2_C2.png');
    game.load.image('Cloud3_C2', 'imgs/cloud3_C2.png');
    game.load.image('Cloud1_C3', 'imgs/cloud1_C3.png');
    game.load.image('Cloud2_C3', 'imgs/cloud2_C3.png');
    game.load.image('Cloud3_C3', 'imgs/cloud3_C3.png');
    game.load.image('Cloud1_C4', 'imgs/cloud1_C4.png');
    game.load.image('Cloud2_C4', 'imgs/cloud2_C4.png');
    game.load.image('Cloud3_C4', 'imgs/cloud3_C4.png');
    game.load.image('Cloud1_C5', 'imgs/cloud1_C5.png');
    game.load.image('Cloud2_C5', 'imgs/cloud2_C5.png');
    game.load.image('Cloud3_C5', 'imgs/cloud3_C5.png');
    game.load.image('Cloud1_C6', 'imgs/cloud1_C6.png');
    game.load.image('Cloud2_C6', 'imgs/cloud2_C6.png');
    game.load.image('Cloud3_C6', 'imgs/cloud3_C6.png');
    game.load.image('Cloud1_C7', 'imgs/cloud1_C7.png');
    game.load.image('Cloud2_C7', 'imgs/cloud2_C7.png');
    game.load.image('Cloud3_C7', 'imgs/cloud3_C7.png');
    game.load.image('Cloud1_C8', 'imgs/cloud1_C8.png');
    game.load.image('Cloud2_C8', 'imgs/cloud2_C8.png');
    game.load.image('Cloud3_C8', 'imgs/cloud3_C8.png');


    game.load.image('Sun_C1', 'imgs/sky_sun_C1.png');
    game.load.image('Moon_C1', 'imgs/sky_moon_C1.png');
    game.load.image('Star_C1', 'imgs/sky_star_C1.png');
    game.load.image('Sun_C2', 'imgs/sky_sun_C2.png');
    game.load.image('Moon_C2', 'imgs/sky_moon_C2.png');
    game.load.image('Star_C2', 'imgs/sky_star_C2.png');
    game.load.image('Sun_C3', 'imgs/sky_sun_C3.png');
    game.load.image('Moon_C3', 'imgs/sky_moon_C3.png');
    game.load.image('Star_C3', 'imgs/sky_star_C3.png');
    game.load.image('Sun_C4', 'imgs/sky_sun_C4.png');
    game.load.image('Moon_C4', 'imgs/sky_moon_C4.png');
    game.load.image('Star_C4', 'imgs/sky_star_C4.png');
    game.load.image('Sun_C5', 'imgs/sky_sun_C5.png');
    game.load.image('Moon_C5', 'imgs/sky_moon_C5.png');
    game.load.image('Star_C5', 'imgs/sky_star_C5.png');
    game.load.image('Sun_C6', 'imgs/sky_sun_C6.png');
    game.load.image('Moon_C6', 'imgs/sky_moon_C6.png');
    game.load.image('Star_C6', 'imgs/sky_star_C6.png');
    game.load.image('Sun_C7', 'imgs/sky_sun_C7.png');
    game.load.image('Moon_C7', 'imgs/sky_moon_C7.png');
    game.load.image('Star_C7', 'imgs/sky_star_C7.png');
    game.load.image('Sun_C8', 'imgs/sky_sun_C8.png');
    game.load.image('Moon_C8', 'imgs/sky_moon_C8.png');
    game.load.image('Star_C8', 'imgs/sky_star_C8.png');

    game.load.image('Tree1_C1', 'imgs/tree_ball_C1.png');
    game.load.image('Tree2_C1', 'imgs/tree_bush_C1.png');
    game.load.image('Tree3_C1', 'imgs/tree_triangle_C1.png');
    game.load.image('Tree1_C2', 'imgs/tree_ball_C2.png');
    game.load.image('Tree2_C2', 'imgs/tree_bush_C2.png');
    game.load.image('Tree3_C2', 'imgs/tree_triangle_C2.png');
    game.load.image('Tree1_C3', 'imgs/tree_ball_C3.png');
    game.load.image('Tree2_C3', 'imgs/tree_bush_C3.png');
    game.load.image('Tree3_C3', 'imgs/tree_triangle_C3.png');
    game.load.image('Tree1_C4', 'imgs/tree_ball_C4.png');
    game.load.image('Tree2_C4', 'imgs/tree_bush_C4.png');
    game.load.image('Tree3_C4', 'imgs/tree_triangle_C4.png');
    game.load.image('Tree1_C5', 'imgs/tree_ball_C5.png');
    game.load.image('Tree2_C5', 'imgs/tree_bush_C5.png');
    game.load.image('Tree3_C5', 'imgs/tree_triangle_C5.png');
    game.load.image('Tree1_C6', 'imgs/tree_ball_C6.png');
    game.load.image('Tree2_C6', 'imgs/tree_bush_C6.png');
    game.load.image('Tree3_C6', 'imgs/tree_triangle_C6.png');
    game.load.image('Tree1_C7', 'imgs/tree_ball_C7.png');
    game.load.image('Tree2_C7', 'imgs/tree_bush_C7.png');
    game.load.image('Tree3_C7', 'imgs/tree_triangle_C7.png');
    game.load.image('Tree1_C8', 'imgs/tree_ball_C8.png');
    game.load.image('Tree2_C8', 'imgs/tree_bush_C8.png');
    game.load.image('Tree3_C8', 'imgs/tree_triangle_C8.png');

    game.load.image('Mount1_C1','imgs/ground_mountain1_C1.png');
    game.load.image('Mount2_C1','imgs/ground_mountain2_C1.png');
    game.load.image('Mount3_C1','imgs/ground_mountain3_C1.png');
    game.load.image('Mount1_C2','imgs/ground_mountain1_C2.png');
    game.load.image('Mount2_C2','imgs/ground_mountain2_C2.png');
    game.load.image('Mount3_C2','imgs/ground_mountain3_C2.png');
    game.load.image('Mount1_C3','imgs/ground_mountain1_C3.png');
    game.load.image('Mount2_C3','imgs/ground_mountain2_C3.png');
    game.load.image('Mount3_C3','imgs/ground_mountain3_C3.png');
    game.load.image('Mount1_C4','imgs/ground_mountain1_C4.png');
    game.load.image('Mount2_C4','imgs/ground_mountain2_C4.png');
    game.load.image('Mount3_C4','imgs/ground_mountain3_C4.png');
    game.load.image('Mount1_C5','imgs/ground_mountain1_C5.png');
    game.load.image('Mount2_C5','imgs/ground_mountain2_C5.png');
    game.load.image('Mount3_C5','imgs/ground_mountain3_C5.png');
    game.load.image('Mount1_C6','imgs/ground_mountain1_C6.png');
    game.load.image('Mount2_C6','imgs/ground_mountain2_C6.png');
    game.load.image('Mount3_C6','imgs/ground_mountain3_C6.png');
    game.load.image('Mount1_C7','imgs/ground_mountain1_C7.png');
    game.load.image('Mount2_C7','imgs/ground_mountain2_C7.png');
    game.load.image('Mount3_C7','imgs/ground_mountain3_C7.png');
    game.load.image('Mount1_C8','imgs/ground_mountain1_C8.png');
    game.load.image('Mount2_C8','imgs/ground_mountain2_C8.png');
    game.load.image('Mount3_C8','imgs/ground_mountain3_C8.png');

    game.load.image('Hill1_C1','imgs/ground_hill1_C1.png');
    game.load.image('Hill2_C1','imgs/ground_hill2_C1.png');
    game.load.image('Hill3_C1','imgs/ground_hill3_C1.png');
    game.load.image('Hill1_C2','imgs/ground_hill1_C2.png');
    game.load.image('Hill2_C2','imgs/ground_hill2_C2.png');
    game.load.image('Hill3_C2','imgs/ground_hill3_C2.png');
    game.load.image('Hill1_C3','imgs/ground_hill1_C3.png');
    game.load.image('Hill2_C3','imgs/ground_hill2_C3.png');
    game.load.image('Hill3_C3','imgs/ground_hill3_C3.png');
    game.load.image('Hill1_C4','imgs/ground_hill1_C4.png');
    game.load.image('Hill2_C4','imgs/ground_hill2_C4.png');
    game.load.image('Hill3_C4','imgs/ground_hill3_C4.png');
    game.load.image('Hill1_C5','imgs/ground_hill1_C5.png');
    game.load.image('Hill2_C5','imgs/ground_hill2_C5.png');
    game.load.image('Hill3_C5','imgs/ground_hill3_C5.png');
    game.load.image('Hill1_C6','imgs/ground_hill1_C6.png');
    game.load.image('Hill2_C6','imgs/ground_hill2_C6.png');
    game.load.image('Hill3_C6','imgs/ground_hill3_C6.png');
    game.load.image('Hill1_C7','imgs/ground_hill1_C7.png');
    game.load.image('Hill2_C7','imgs/ground_hill2_C7.png');
    game.load.image('Hill3_C7','imgs/ground_hill3_C7.png');
    game.load.image('Hill1_C8','imgs/ground_hill1_C8.png');
    game.load.image('Hill2_C8','imgs/ground_hill2_C8.png');
    game.load.image('Hill3_C8','imgs/ground_hill3_C8.png');

  },
  create: function(){

    level = 1;

    backgroundWidth = 2735;
    backgroundHeight = 2305;

    for (var i = 0; i < numLevels; i++){
      colorTheme.push(getRandomInt(1,9));
      //colorTheme.push(1);
      treeType.push(getRandomInt(1,4));
      //treeType.push(2);
      skyType.push(getRandomInt(1,3));
      //skyType.push(2);
      starInd.push(getRandomInt(0,2));
      //starInd.push(1);
      groundType.push(getRandomInt(1,3));
      //groundType.push(1);
      groundY1.push(300 + 50*(Math.random()*2 - 1));
      groundY2.push(300 + 50*(Math.random()*2 - 1));
      groundY3.push(300 + 50*(Math.random()*2 - 1));
      groundY.push([groundY1[i], groundY2[i], groundY3[i]]);
      groundY[i].sort(function(a,b){
        return a- b;
      });
      groundX.push(shuffleArray([-100, 200, 500]));
      treeY.push([groundY[i][0] + 200 + 30*Math.random(),groundY[i][1] + 200 + 30*Math.random(),groundY[i][2] + 200 + 30*Math.random()]);
      treeX.push([groundX[i][0] + 200 + 100*Math.random(),groundX[i][1] + 200 + 100*Math.random(),groundX[i][2] + 200 + 100*Math.random()]);
      groundImgType.push([getRandomInt(1,3),getRandomInt(1,3),getRandomInt(1,3)]);
      skyX.push(600 + Math.random());
      skyY.push(50 + Math.random());
      starX.push([100 + 50*(Math.random()*2 - 1), 200 + 50*(Math.random()*2 - 1), 300 + 50*(Math.random()*2 - 1), 400 + 50*(Math.random()*2 - 1),
                                500 + 50*(Math.random()*2 - 1), 700 + 50*(Math.random()*2 - 1)]);
      starY.push([40 + 30*(Math.random()*2 - 1), 40 + 30*(Math.random()*2 - 1), 40 + 30*(Math.random()*2 - 1), 40 + 30*(Math.random()*2 - 1),
                                40 + 30*(Math.random()*2 - 1), 40 + 30*(Math.random()*2 - 1)]);
      starScale.push([Math.random()*.4 + .8, Math.random()*.4 + .8, Math.random()*.4 + .8,Math.random()*.4 + .8, Math.random()*.4 + .8, Math.random()*.4 + .8])

    }


    if (colorTheme[level-1] == 1){
      color1 = 0x6DBCDB;
      color2 = 0xFFFFFF;
      color3 = 0xD28EB5;
      color4 = 0x7A526C;
      color5 = 0xAB9B9E;
    } else if (colorTheme[level-1] == 2){
      color1 = 0x554236;
      color2 = 0xF77825;
      color3 = 0xD3CE3D;
      color4 = 0xF1EFA5;
      color5 = 0x60B99A;
    } else if (colorTheme[level-1] == 3){
      color1 = 0x587477;
      color2 = 0xBEA544;
      color3 = 0xF67272;
      color4 = 0xF9285E;
      color5 = 0xB64960;
    } else if (colorTheme[level-1] == 4){
      color1 = 0x1F100B;
      color2 = 0x39446E;
      color3 = 0x6C98A4;
      color4 = 0xECDCCD;
      color5 = 0xC40101;
    } else if (colorTheme[level-1] == 5){
      color1 = 0x7C9E9D;
      color2 = 0x9598AD;
      color3 = 0xFAEBD0;
      color4 = 0xD4A44A;
      color5 = 0x80936D;
    } else if (colorTheme[level-1] == 6){
      color1 = 0xFFF0AB;
      color2 = 0x7A6E7C;
      color3 = 0xE08D28;
      color4 = 0xC6C00E;
      color5 = 0xB7ADB6;
    } else if (colorTheme[level-1] == 7){
      color1 = 0x3E3C4A;
      color2 = 0x6E6489;
      color3 = 0xAD8FB1;
      color4 = 0xFFC7C5;
      color5 = 0xB05372;
    } else {
      color1 = 0x52060A;
      color2 = 0xC0596C;
      color3 = 0xEBD8D4;
      color4 = 0xC4BFA9;
      color5 = 0x9F8964;
    }

    if (treeType[level-1] == 1){
      treeImg = 'Tree1';
      bushInd = 0;
    } else if (treeType[level-1] == 2){
      treeImg = 'Tree2';
      bushInd = 1;
    } else {
      treeImg = 'Tree3';
      bushInd = 0;
    }


    if (skyType[level-1] == 1){
      skyImg = 'Sun';
    } else {
      skyImg = 'Moon';
    };

    if (groundType[level-1] == 1){
      groundImg = 'Mount';
    } else {
      groundImg = 'Hill';
    }


    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    keyF = game.input.keyboard.addKey(Phaser.Keyboard.F);
    keyF.onDown.add(goFull, this);

    game.time.advancedTiming = true;
    game.stage.backgroundColor = color5;

//////// Background
    backgroundGroup = game.add.group();

    groundGraphics = game.add.graphics(0,0);
    groundGraphics.beginFill(color3);
    groundGraphics.drawRect(0, 2*screen1Height/3, screenWidth, screen1Height/3);
    groundGraphics.endFill();
    groundGraphics.fixedToCamera = true;

    mount1 = game.add.sprite(groundX[level-1][0], groundY[level-1][0], groundImg + groundImgType[level-1][0]+ '_C' + colorTheme[level-1]);
    mount1.fixedToCamera = true;
    //mount1.scale.setTo(0.9, 0.9);
    backgroundGroup.add(mount1);

    mount2 = game.add.sprite(groundX[level-1][1], groundY[level-1][1], groundImg + groundImgType[level-1][1]+ '_C' + colorTheme[level-1]);
    mount2.fixedToCamera = true;
    //mount2.scale.setTo(0.9,0.9);
    backgroundGroup.add(mount2);

    mount3 = game.add.sprite(groundX[level-1][2], groundY[level-1][2], groundImg + groundImgType[level-1][2]+ '_C' + colorTheme[level-1]);
    mount3.fixedToCamera = true;
    //mount3.scale.setTo(0.9,0.9);
    backgroundGroup.add(mount3);

    tree1 = game.add.sprite(treeX[level-1][0], treeY[level-1][0] + bushInd*50, treeImg + '_C' + colorTheme[level-1]);
    tree1.fixedToCamera = true;
    //tree1.scale.setTo(0.5,0.5);
    backgroundGroup.add(tree1);

    tree2 = game.add.sprite(treeX[level-1][1], treeY[level-1][1] + bushInd*50, treeImg + '_C' + colorTheme[level-1]);
    tree2.fixedToCamera = true;
    //tree2.scale.setTo(0.5,0.5);
    backgroundGroup.add(tree2);

    tree3 = game.add.sprite(treeX[level-1][2], treeY[level-1][2] + bushInd*50, treeImg + '_C' + colorTheme[level-1]);
    tree3.fixedToCamera = true;
    //tree3.scale.setTo(0.5,0.5);
    backgroundGroup.add(tree3);

    if ((starInd[level-1] == 1)&(skyType[level-1] == 2)){
      star1 = game.add.sprite(starX[level-1][0], starY[level-1][0], 'Star' + '_C' + colorTheme[level-1]);
      star1.fixedToCamera = true;
      backgroundGroup.add(star1);
      star1.scale.setTo(starScale[level-1][0]);

      star2 = game.add.sprite(starX[level-1][1], starY[level-1][1], 'Star' + '_C' + colorTheme[level-1]);
      star2.fixedToCamera = true;
      backgroundGroup.add(star2);
      star2.scale.setTo(starScale[level-1][1]);

      star3 = game.add.sprite(starX[level-1][2], starY[level-1][2], 'Star' + '_C' + colorTheme[level-1]);
      star3.fixedToCamera = true;
      backgroundGroup.add(star3);
      star3.scale.setTo(starScale[level-1][2]);

      star4 = game.add.sprite(starX[level-1][3], starY[level-1][3],'Star' + '_C' + colorTheme[level-1]);
      star4.fixedToCamera = true;
      backgroundGroup.add(star4);
      star4.scale.setTo(starScale[level-1][3]);

      star5 = game.add.sprite(starX[level-1][4], starY[level-1][4], 'Star' + '_C' + colorTheme[level-1]);
      star5.fixedToCamera = true;
      backgroundGroup.add(star5);
      star5.scale.setTo(starScale[level-1][4]);

      star6 = game.add.sprite(starX[level-1][5], starY[level-1][5], 'Star' + '_C' + colorTheme[level-1]);
      star6.fixedToCamera = true;
      backgroundGroup.add(star6);
      star6.scale.setTo(starScale[level-1][5]);
    };

    sky = game.add.sprite(skyX[level-1], skyY[level-1], skyImg + '_C' + colorTheme[level-1]);
    sky.fixedToCamera = true;
    //sky.scale.setTo(0.4,0.4);
    backgroundGroup.add(sky);

/////////


    totalFrames = 0;
    actualYes = 0;
    actualNo = 0;
    predictYes = 0;
    numCorrect = 0;
    truePositive = 0;
    trueNegative = 0;
    falsePositive = 0;
    falseNegative = 0;
    X = [];
    Y = [];

    training = true;

    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.gravity.y = gravity;
    game.physics.box2d.restitution = restitution;
    //game.physics.box2d.setBoundsToWorld();

    frontGroup = game.add.group();
    statGroup = game.add.group();

    squirrel = new Squirrel(game, 'Squirrel');
    terrain = new Terrain(game, 1, 1, color1,'Cloud1' + '_C' + colorTheme[level-1],'Cloud2' + '_C' + colorTheme[level-1],'Cloud3' + '_C' + colorTheme[level-1]);
    player = new Player(game, squirrel, terrain, level);
    machine = new kNear(k);

    game.camera.bounds = null;
    // game.camera.y = -screen1Height/2;
    game.camera.y = -screen1Height/1.5;
    cursors = game.input.keyboard.createCursorKeys();
    //game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    quitButton = game.add.text(screen1Width*.02,screen1Height*.02, 'Quit', {fontSize: '18px', fill: '#000000'});
    pauseButton = game.add.text(screen1Width*.08,screen1Height*.02, 'Pause', {fontSize: '18px', fill: '#000000'});
    muteButton = game.add.text(screen1Width*.16,screen1Height*.02, 'Mute', {fontSize: '18px', fill: '#000000'});
    fullScreenButton = game.add.text(screen1Width*.23,screen1Height*.02, 'Full Screen', {fontSize: '18px', fill: '#000000'});
    evaluateButton = game.add.text(screen1Width*.36,screen1Height*.02, 'Switch to AI', {fontSize: '18px', fill: '#000000'});
    quitButton.fixedToCamera = true;
    frontGroup.add(quitButton);
    pauseButton.fixedToCamera = true;
    frontGroup.add(pauseButton);
    muteButton.fixedToCamera = true;
    frontGroup.add(muteButton);
    fullScreenButton.fixedToCamera = true;
    frontGroup.add(fullScreenButton);
    evaluateButton.fixedToCamera = true;
    frontGroup.add(evaluateButton);
    quitButton.inputEnabled = true;
    pauseButton.inputEnabled = true;
    muteButton.inputEnabled = true;
    fullScreenButton.inputEnabled = true;
    evaluateButton.inputEnabled = true;
    quitButton.events.onInputDown.add(quitGame, this);
    pauseButton.events.onInputDown.add(pause, this);
    muteButton.events.onInputDown.add(mute, this);
    fullScreenButton.events.onInputDown.add(goFull, this);
    evaluateButton.events.onInputDown.add(chngEvalStatus, this);

    game.input.onDown.add(pausedClick, self);

    levelProgress = game.add.graphics(0,0);
    levelProgress.fixedToCamera = true;
    levelProgress.lineStyle(2, 0x000000, 1);
    levelProgress.moveTo(.1*screen1Width,screen1Height*.07)
    levelProgress.lineTo(.9*screen1Width, screen1Height*.07);

    squirrelProgress = game.add.graphics(0,0);
    squirrelProgress.fixedToCamera = true;

    text = game.add.text(screen1Width*.02,screen1Height*.09, 'Level: 1', {fontSize: '20px',fontWeight:'bold', fill: '#000000'});
    text.fixedToCamera = true;

    trainingText = game.add.text(screen1Width*.02,screen1Height*.13, 'Training', {fontSize: '20px', fontWeight: 'bold', fill: '#000000'});
    trainingText.fixedToCamera = true;
    keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
    keyE.onDown.add(chngEvalStatus, this);
    keyP = game.input.keyboard.addKey(Phaser.Keyboard.P);
    keyP.onDown.add(pause, this);
    keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    keyQ.onDown.add(quitGame, this);
    keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
    keyM.onDown.add(mute, this);

    timer = game.time.create();
    //timerEvent = timer.add(Phaser.Timer.MINUTE*1 + Phaser.Timer.SECOND*30,this.endTimer,this);
    timerEvent = timer.add(Phaser.Timer.MINUTE*2 + Phaser.Timer.SECOND*0);
    timer.start();

    downArrow = game.add.sprite(screen1Width*.925,screen1Height*0.08, 'Arrow');
    //downArrow.scale.setTo(24/786,30/1024);
    downArrow.fixedToCamera = true;

    sideCanvas = game.add.graphics(0,0);
    sideCanvas.beginFill(0xffffff);
    sideCanvas.drawRect(screenWidth*0.67, 0, screenWidth*0.33, screenHeight);
    sideCanvas.endFill();
    sideCanvas.fixedToCamera = true;

    rateText = game.add.text(screenWidth*0.7, screen2Height*0.1, 'Misclassification Rate:', {fontSize: '14px',fontWeight: 'bold',fill: '#000000'});
    tpText = game.add.text(screenWidth*0.7, screen2Height*0.2, 'True Positive Rate:', {fontSize: '14px', fontWeight: 'bold', fill:'#000000'});
    fpText = game.add.text(screenWidth*0.7, screen2Height*0.3, 'False Positive Rate:', {fontSize: '14px', fontWeight: 'bold', fill: '#000000'});
    specText = game.add.text(screenWidth*0.7, screen2Height*0.4, 'Specificity:', {fontSize: '14px', fontWeight: 'bold', fill: '#000000'});
    precText = game.add.text(screenWidth*0.7, screen2Height*0.5, 'Precision:', {fontSize: '14px', fontWeight: 'bold', fill: '#000000'});
    prevText = game.add.text(screenWidth*0.7, screen2Height*0.6, 'Prevalence:', {fontSize: '14px', fontWeight: 'bold', fill: '#000000'});

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

  },
  update: function(){

    game.world.bringToTop(backgroundGroup);
    game.world.bringToTop(frontGroup);
    game.world.bringToTop(statGroup);

    //console.log(machine.training.length);

    squirrelX = squirrel.getPositionX();
    squirrelY = squirrel.getPositionY();

    zoom = Math.min(1, Math.pow((screen1Height-30)/(250-squirrelY),0.75));

    quitButton.scale.setTo(1/zoom);
    pauseButton.scale.setTo(1/zoom);
    muteButton.scale.setTo(1/zoom);
    fullScreenButton.scale.setTo(1/zoom);
    evaluateButton.scale.setTo(1/zoom);

    mount1.scale.setTo(1/zoom);
    mount2.scale.setTo(1/zoom);
    mount3.scale.setTo(1/zoom);
    tree1.scale.setTo(1/zoom);
    tree2.scale.setTo(1/zoom);
    tree3.scale.setTo(1/zoom);
    groundGraphics.scale.setTo(1/zoom);
    sky.scale.setTo(1/zoom);
    if ((starInd[level-1] == 1)&(skyType[level-1] == 2)){
      star1.scale.setTo(starScale[level-1][0]/zoom);
      star2.scale.setTo(starScale[level-1][1]/zoom);
      star3.scale.setTo(starScale[level-1][2]/zoom);
      star4.scale.setTo(starScale[level-1][3]/zoom);
      star5.scale.setTo(starScale[level-1][4]/zoom);
      star6.scale.setTo(starScale[level-1][5]/zoom);
    };


    game.world.scale.setTo(zoom);
    game.camera.x = squirrelX*zoom - 100;
    //game.camera.y = -screen1Height/2 - screen1Height + screen1Height*zoom;
    game.camera.y = -screen1Height/1.5 - screen1Height + screen1Height*zoom;

    s = Math.round((timerEvent.delay - timer.ms) / 1000);
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
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
      // link.setAttribute("download", "SquirrelDataLevel1.csv");
      // link.click();

      squirrelProgress.destroy();
      game.state.start('levelFailed');
    };
    text.text = "Level: " + 1 + "   Time Remaining: " + minutes.substr(-2) + ":" + seconds.substr(-2);

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

    canBoost = false;
    canPara = false;

    if (training){
      if (cursors.down.isDown) {
        squirrel.dive();
        isDiving = 1;
      } else{
        isDiving = 0;
      };
    } else{
      currFeatures = player.stateToFeatures();
      isDiving = machine.classify(currFeatures, canBoost, canPara);
      if (isDiving == 1){
        squirrel.dive();
      };
    };

    if (isDiving == 1){
      downArrow.destroy();
      downArrow = game.add.sprite(screen1Width*.925,screen1Height*0.08, 'Arrow');
      //downArrow.scale.setTo(24/(zoom*786),30/(zoom*1024));
      downArrow.scale.setTo(1/zoom);
      downArrow.fixedToCamera = true;
    } else {
      downArrow.destroy();
    };

    squirrelProgress.destroy();
    squirrelProgress = game.add.graphics(0,0);
    squirrelProgress.fixedToCamera = true;
    squirrelProgress.beginFill(0xFF0000);
    squirrelProgress.drawCircle(.1*screen1Width + .8*screen1Width*squirrelX/levelLength, .07*screen1Height, 20);
    squirrelProgress.endFill();
    squirrelProgress.scale.setTo(1/zoom);

    if (squirrelX > levelLength){
      //machine.clean();

      // var data = Y;
      // var csvContent = "data:text/csv;charset=utf-8,";
      // data.forEach(function(infoArray, index){
      //    dataString = infoArray.join(",");
      //    csvContent += index < data.length ? dataString+ "\n" : dataString;
      // });
      // var encodedUri = encodeURI(csvContent);
      // var link = document.createElement("a");
      // link.setAttribute("href", encodedUri);
      // link.setAttribute("download", "SquirrelDataLevel1.csv");
      // link.click();

      //console.log(machine.training.length);

      squirrelProgress.destroy();
      if (training){
        game.state.start('level1Complete');
      } else{
        game.state.start('autoLevelComplete');
      };
    };

    terrain.updateKnots(squirrelX/PTM);

    squirrel.updatePosition();

    if (training){
      currFeatures = player.stateToFeatures();
      machine.learn(currFeatures, isDiving);
      predict = machine.classify(currFeatures, canBoost, canPara);
      window.sendPcaData(currFeatures);
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
    };

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
    }

    var pc2 = window.pComp;
    if (pc2 !== null) {
      window.pComp = null;

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
      }

      points = game.add.graphics(0,0);
      points.beginFill(0xff0000);
      points.lineStyle(2, 0xff0000 , 1);

      col0 = pc2.map(function(value,index) { return value[0]; });
      col1 = pc2.map(function(value,index) { return value[1]; });
      dim0 = numeric.dot(col0, currFeatures);
      dim1 = numeric.dot(col1, currFeatures);
      points.drawCircle(screen1Width + screen3Width*0.5 + dim0*plotDim/(5*2), screen2Height + screen3Height*0.5 - dim1*plotDim/(5*2), 2);
      points.endFill();

      neighbors = machine.nearest(currFeatures, canBoost, canPara);
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
    } // end if training (mcoleman)

    //game.camera.focusOnXY(squirrel._body.x + 300.0, squirrel._body.y);
  },
  render: function(){
    //game.debug.box2dWorld();
    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.text(game.time.fps,2,14,'#00ff00')
  }
};

function goFull(){
  if (game.scale.isFullScreen){
    game.scale.stopFullScreen();
  } else {
    game.scale.startFullScreen(false);
  };
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

function quitGame(){
  music.stop();
  game.state.start('menu')
}

function pause(){
  if (isPaused){
    isPaused = false;
    game.paused = false;
  } else{
    isPaused = true;
    game.paused = true;
  }
}

function mute(){
  if (isMuted){
    isMuted = false;
    game.sound.mute = false;
  } else{
    isMuted = true;
    game.sound.mute = true;
  }
}

function pausedClick(){
  if (isPaused){
    if ((this.game.input.y > 5)&(this.game.input.y < 40)){
      if ((this.game.input.x > 5)&(this.game.input.x < 60)){
        pause();
        quitGame();
      } else if ((this.game.input.x > 60)&(this.game.input.x < 125)){
        pause();
      } else if ((this.game.input.x > 125)&(this.game.input.x < 185)){
        mute();
      } else if ((this.game.input.x > 185)&(this.game.input.x < 295)){
        goFull();
      } else if ((this.game.input.x > 295)&(this.game.input.x < 410)){
        chngEvalStatus();
      }
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
