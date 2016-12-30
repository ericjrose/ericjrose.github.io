var game;
var game2;
var game3;
var screen1Height = 720; //720
var screen1Width = 854;  //854
var screen2Height = 360;
var screen2Width = 427;
var screen3Height = 360;
var screen3Width = 427;
var gravity = 400;
var friction = 0.15;

game = new Phaser.Game(screen1Width, screen1Height, Phaser.CANVAS, 'game');
game2 = new Phaser.Game(screen2Width, screen2Height, Phaser.CANVAS, 'game2');
game3 = new Phaser.Game(screen3Width, screen3Height, Phaser.CANVAS, 'game3');

game.state.add('Game', Game);
game2.state.add('Game2', Game2);

game.state.add('Tutorial', Tutorial);
game2.state.add('Tutorial_2', Tutorial_2);
game3.state.add('Tutorial_3', Tutorial_3);

game.state.add('tutorialMenu', tutorialMenu);
game2.state.add('tutorialMenu', tutorialMenu);
game3.state.add('tutorialMenu', tutorialMenu);

game.state.add('tutorialComplete', tutorialComplete);
game2.state.add('tutorialComplete', tutorialComplete);
game3.state.add('tutorialComplete', tutorialComplete);

game.state.add('Level1', Level1);
game2.state.add('Level1_2', Level1_2);
game3.state.add('Level1_3', Level1_3);

game.state.add('Level2', Level2);
game2.state.add('Level2_2', Level2_2);
game3.state.add('Level2_3', Level2_3);

game.state.add('Level3', Level3);
game2.state.add('Level3_2', Level3_2);
game3.state.add('Level3_3', Level3_3);

game.state.add('Level', Level);
game2.state.add('Level_2', Level_2);
game3.state.add('Level_3', Level_3);

game.state.add('menu', menu);
game2.state.add('menu', menu);
game3.state.add('menu', menu);

game.state.add('levelFailed', levelFailed);
game2.state.add('levelFailed', levelFailed);
game3.state.add('levelFailed', levelFailed);

game.state.add('level1Game1Complete', level1Game1Complete);
game2.state.add('level1Complete', level1Complete);
game3.state.add('level1Complete', level1Complete);

game.state.add('level2Game1Complete', level2Game1Complete);
game2.state.add('level2Complete', level2Complete);
game3.state.add('level2Complete', level2Complete);

game.state.add('level3Game1Complete', level3Game1Complete);
game2.state.add('level3Complete', level3Complete);
game3.state.add('level3Complete', level3Complete);

game.state.add('levelGame1Complete', levelGame1Complete);
game2.state.add('levelComplete', levelComplete);
game3.state.add('levelComplete', levelComplete);

game.state.start('menu');
game2.state.start('menu');
game3.state.start('menu');

// game.state.start('Tutorial');
// game2.state.start('Tutorial_2');
// game3.state.start('Tutorial_3');

//game.state.start('Level1');
//game2.state.start('Level3_2');
//game3.state.start('Level3_3');
