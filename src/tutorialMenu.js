
var selection = 1;

var tutorialMenu = {
  preload: function() {
      game.stage.backgroundColor = '#000000';
      game.load.image('backgroundImg','imgs/Flying Squirrel Title Screen L0.png')
  },
  create: function() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.input.onDown.add(goFull, this);

    background = game.add.tileSprite(0, 0, 4608, 2307,'backgroundImg'); //Image is 4808x2307
    background.scale.setTo(screenWidth/4608,screenHeight/2307);
    background.fixedToCamera = true;

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(selectOption, this);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    upKey.onDown.add(changeOption, this);
    downKey.onDown.add(changeOption, this);

    textOption1 = game.add.text(430, 300, "Watch Tutorial", {fontSize: '60px', fill: "#FFF", align: "center"});
    textOption2 = game.add.text(520, 380, "Start Level 1", {fontSize: '60px', fill: "#D3D3D3", align: "center"});
    textOption2.scale.setTo(0.6);
  }
};

function changeOption(){
  if (selection == 1){
    // textOption1 = game.add.text(500, 300, "Watch Tutorial", {fontSize: '40px', fill: "#D3D3D3", align: "center"});
    // textOption2 = game.add.text(450, 380, "Start Level 1", {fontSize: '50px', fill: "#FFF", align: "center"});
    textOption1.fill = '#D3D3D3';
    textOption2.fill = '#FFF';
    textOption1.scale.setTo(0.6);
    textOption2.scale.setTo(1);
    textOption1.x = 500;
    textOption1.y = 320;
    textOption2.x = 460;
    textOption2.y = 370;
    selection = 2;
  } else {
    // textOption1 = game.add.text(450, 300, "Watch Tutorial", {fontSize: '50px', fill: "#FFF", align: "center"});
    // textOption2 = game.add.text(500, 380, "Start Level 1", {fontSize: '40px', fill: "#D3D3D3", align: "center"});
    textOption1.fill = '#FFF';
    textOption2.fill = '#D3D3D3';
    textOption1.scale.setTo(1);
    textOption2.scale.setTo(0.6);
    textOption1.x = 430;
    textOption1.y = 300;
    textOption2.x = 520;
    textOption2.y = 380;
    selection = 1;
  };
};

function selectOption(){
  if (selection == 1){
    game.state.start('Tutorial');
  } else {
    game.state.start('Level1');
  }
};
