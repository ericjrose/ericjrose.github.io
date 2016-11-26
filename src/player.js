function Player(game, squirrel, terrain){
  this.game = game;
  this.squirrel = squirrel;
  this.terrain = terrain;
};

Player.prototype.stateToFeatures = function() {
  features = [];

  squirrelX = this.squirrel.getPositionX();
  squirrelY = this.squirrel.getPositionY();

  hillY = this.terrain.hillFn.at(squirrelX/PTM);

  //console.log(game.physics.arcade.collide(this.squirrel, this.terrain));
  //console.log('HillY: ' + hillY);
  //console.log('SqY: ' + squirrelY/PTM);

  // Adjusted for radius of squirrel
  if (squirrelY/PTM + 3 < hillY){
    grounded = 0;
  }
  else{
    grounded = 1;
  }
  features.push(grounded);

  velX = this.squirrel.getVelocityX()/PTM;
  velY = this.squirrel.getVelocityY()/PTM;
  hypVel = Math.sqrt(Math.pow(velX,2) + Math.pow(velY,2));

  features.push(velX, velY, hypVel);

  angle = Math.atan(velY/velX);
  features.push(angle);

  bisect = bisect_left(this.terrain.knotsX, squirrelX/PTM, 0, this.terrain.knotsX.length);

  knot1 = this.terrain.knotsX[bisect];
  knot2 = this.terrain.knotsX[bisect + 1];

  midpt = (knot1 + knot2)/2;
  xKnots = [knot1, midpt, knot2];
  for (i = 0; i < xKnots.length; i++){
    deriv = this.terrain.hillFn.diff().at(xKnots[i]);
    val = this.terrain.hillFn.at(xKnots[i]);
    dx = xKnots[i] - squirrelX/PTM;
    dy = val - squirrelY/PTM;
    knotAngle = Math.atan(dy/dx);
    features.push(deriv, knotAngle);
  };

  heightKnot1 = this.terrain.knotsY[bisect];
  heightKnot2 = this.terrain.knotsY[bisect + 1];
  if (heightKnot1 > heightKnot2){
    distToApex = knot1 - squirrelX/PTM;
    distToVall = knot2 - squirrelX/PTM;
  } else {
    distToApex = knot2 - squirrelX/PTM;
    distToVall = knot1 - squirrelX/PTM;
  };

  features.push(distToVall, distToApex);

  return features;

};
