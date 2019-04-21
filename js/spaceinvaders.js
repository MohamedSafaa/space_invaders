/*
  spaceinvaders.js
*/

//  Constants for the keyboard.
const KEY_LEFT = 37, KEY_RIGHT = 39, KEY_SPACE = 32, KEY_PAUSE = 27;

const ships = ['images/blackSpaceShip.ico', 'images/whiteSpaceShip.ico', 'images/redSpaceShip.ico'];
const image = ["Eric", "Naglaa", "Richard"];
const rocketShapes =['images/blackSpaceShipShot.png','images/whiteSpaceShipShot.png','images/redSpaceShipShot.png'];

var ind = (window.localStorage.getItem('index'))?parseInt(window.localStorage.getItem('index')):0;

//  Creates an instance of the Game class.
function Game() {

    //  Set the initial config.
    this.config = {
        bombRate: 0.05,
        bombMinVelocity: 50,
        bombMaxVelocity: 50,
        invaderInitialVelocity: 25,
        invaderAcceleration: 5,
        invaderDropDistance: 20,
        rocketVelocity: 120,
        rocketMaxFireRate: 2,
        gameWidth: 1100,
        gameHeight: 530,
        fps: 50,
        invaderRanks: 6,
        invaderFiles: 15,
        shipSpeed: 120,
        levelDifficultyMultiplier: 0.2,
        pointsPerInvader: 5,
        limitLevelIncrease: 25
    };

    //  All state is in the variables below.
    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.gameBounds = {left: 0, top: 0, right: 0, bottom: 0};
    this.intervalId;
    this.score = 0;
    this.level = 1;

    //  The state stack.
    this.stateStack = [];

    //  Input/output
    this.pressedKeys = {};
    this.gameCanvas = null;

    //  All sounds.
    this.sounds = null;
}

//  Initialis the Game with a canvas.
Game.prototype.initialise = function(gameCanvas) {

    //  Set the game canvas.
    this.gameCanvas = gameCanvas;

    //  Set the game width and height.
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    //  Set the state game bounds.
    this.gameBounds = {
        left: gameCanvas.width / 2 - this.config.gameWidth / 2,
        right: gameCanvas.width / 2 + this.config.gameWidth / 2,
        top: gameCanvas.height / 2 - this.config.gameHeight / 2,
        bottom: gameCanvas.height / 2 + this.config.gameHeight / 2 
    };
};

Game.prototype.moveToState = function(nextState) {
 
   //  If we are in a state, leave it.
   if(this.currentState() && this.currentState().leave) {
     this.currentState().leave(game);
     this.stateStack.pop();
   }
   
   //  If there's an enter function for the new state, call it.
   if(nextState.enter) {
       nextState.enter(game);
   }
 
   //  Set the current state.
   this.stateStack.pop();
   this.stateStack.push(nextState);
 };

//  Start the Game.
Game.prototype.start = function() {

    //  Move into the 'welcome' state.
    this.moveToState(new WelcomeState());

    //  Set the game variables.
    this.lives = 3;

    //  Start the game loop.
    var game = this;
    this.intervalId = setInterval(function () {GameLoop(game);}, 1000 / this.config.fps);
};

//  Returns the current state.
Game.prototype.currentState = function() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
};

//  Mutes or unmutes the game.
Game.prototype.mute = function(mute) {

    //  If we've been told to mute, mute.
    if(mute === true) {
        this.sounds.mute = true;
    } else if (mute === false) {
        this.sounds.mute = false;
    } else {
        // Toggle mute instead...
        this.sounds.mute = this.sounds.mute ? false : true;
    }
};

//  The main loop.
function GameLoop(game) {
    var currentState = game.currentState();
    if(currentState) {

        //  Delta t is the time to update/draw.
        var updateDrawTime = 1 / game.config.fps;

        //  Get the drawing context.
        if(this.gameCanvas)
        var currentContext = this.gameCanvas.getContext("2d");
        
        //  Update if we have an update function.
        if(currentState.update) {
            currentState.update(game, updateDrawTime);
        }

        // Draw if we have a draw function.
        if(currentState.draw) {
            currentState.draw(game, updateDrawTime, currentContext);
        }
    }
}

Game.prototype.pushState = function(state) {
    // If there's an enter function for the new state, call it.
    if(state.enter) {
        state.enter(game);
    }

    // Set the current state.
    this.stateStack.push(state);
};

Game.prototype.popState = function() {
    // Leave and pop the state.
    if(this.currentState()) {
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }

        // Set the current state.
        this.stateStack.pop();
    }
};

// The stop function stops the game.
Game.prototype.stop = function Stop() {
    clearInterval(this.intervalId);
};

//  Inform the game a key is down.
Game.prototype.keyDown = function(keyCode) {
    this.pressedKeys[keyCode] = true;

    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, keyCode);
    }
};

//  Inform the game a key is up.
Game.prototype.keyUp = function(keyCode) {
    delete this.pressedKeys[keyCode];

    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyUp) {
        this.currentState().keyUp(this, keyCode);
    }
};

function WelcomeState() {}

WelcomeState.prototype.enter = function(game) {

    // Create and load the sounds.
    game.sounds = new Sounds();
    game.sounds.init();
    game.sounds.loadSound('shoot', 'sounds/shoot.wav');
    game.sounds.loadSound('bang', 'sounds/bang.wav');
    game.sounds.loadSound('explosion', 'sounds/explosion.wav');
};

WelcomeState.prototype.update = function (game, updateTime) {};

WelcomeState.prototype.draw = function(game, drawTime, contextConvas) {

    //  Clear the background.
    contextConvas.clearRect(0, 0, game.width, game.height);

    contextConvas.font="30px Arial";
    contextConvas.fillStyle = '#ffffff';
    contextConvas.textBaseline="center"; 
    contextConvas.textAlign="center"; 
    contextConvas.fillText("Space Invaders", game.width / 2, game.height/2 - 40); 
    contextConvas.font="16px Arial";
    contextConvas.fillStyle = '#e9f979'

    contextConvas.fillText("Press 'Space' to start.", game.width / 2, game.height/2); 
};

WelcomeState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == KEY_SPACE) {
        //  Space starts the game.
        game.level = 1;
        game.score = 0;
        game.lives = 3;
        game.moveToState(new LevelIntroState(game.level));
    }
};

function GameOverState() {}

GameOverState.prototype.update = function(game, updateTime) {};

GameOverState.prototype.draw = function(game, drawTime, contextConvas) {
    //  Clear the background.
    contextConvas.clearRect(0, 0, game.width, game.height);

    contextConvas.font="30px Arial";
    contextConvas.fillStyle = '#ffffff';
    contextConvas.textBaseline="center"; 
    contextConvas.textAlign="center"; 
    contextConvas.fillText("Game Over!", game.width / 2, game.height/2 - 40); 
    contextConvas.font="16px Arial";
    contextConvas.fillText("You scored " + game.score + " and got to level " + game.level, game.width / 2, game.height/2);
    contextConvas.font="16px Arial";
    contextConvas.fillText("Press 'Space' to play again.", game.width / 2, game.height/2 + 40);   
};

GameOverState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == KEY_SPACE) {
        //  Space restarts the game.
        game.lives = 3;
        game.score = 0;
        game.level = 1;
        game.moveToState(new LevelIntroState(1));
    }
};

//  Create a PlayState with the game config and the level you are on.
function PlayState(config, level) {
    this.SHIP_ALIVE = 0;
    this.SHIP_EXPLODES = 1;
    this.SHIP_REFRESHS = 2;
    this.SHIP_EXPLOSION_PHASES = 5;

    this.config = config;
    this.level = level;

    //  Game state.
    this.invaderCurrentVelocity;
    this.invaderCurrentDropDistance;
    this.invadersAreDropping;
    this.lastRocketTime = null;

    //  Game entities.
    this.ship = null;
    this.invaders = [];
    this.rockets = [];
    this.bombs = [];
    this.bombImage = new Image();
    this.invaderImage = new Image();
    this.rocketImage;
    this.shipExplosiontStates = [];
}

PlayState.prototype.enter = function(game) {
    //  Create the ship.
    this.ship = new Ship(game.width / 2, game.gameBounds.bottom, this.SHIP_ALIVE);
    var imgIndex = window.localStorage.getItem('index');
    this.ship.image.src = ships[imgIndex];
    for (let i = 2; i < 2 + this.SHIP_EXPLOSION_PHASES; i++) {
        this.shipExplosiontStates.push("images/alienSpaceShipExplosion_" + i + ".ico");
    }

    // Initialize invader and it's bomb
    this.invaderImage.src = "images/alienSpaceShip.ico";
    this.bombImage.src = "images/bomb.png";
    

    // Set the Images sources 
    this.rocketImage = new RocketModel(new Image(), 4);
    // this.rocketImage.image.src = "images/redSpaceShipShot.png";
    this.rocketImage.image.src = rocketShapes[imgIndex];
    this.rocketImage.height = 550;
    this.rocketImage.width = 90 ;

    // Setup initial state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;

    // Set the ship speed for this level, as well as invader params.
    var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    var limitLevel = (this.level < this.config.limitLevelIncrease ? this.level : this.config.limitLevelIncrease);
    this.shipSpeed = this.config.shipSpeed;
    this.invaderInitialVelocity = this.config.invaderInitialVelocity + 1.5 * (levelMultiplier * this.config.invaderInitialVelocity);
    this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate);
    this.bombMinVelocity = this.config.bombMinVelocity + (levelMultiplier * this.config.bombMinVelocity);
    this.bombMaxVelocity = this.config.bombMaxVelocity + (levelMultiplier * this.config.bombMaxVelocity);
    this.rocketMaxFireRate = this.config.rocketMaxFireRate + 0.4 * limitLevel;

    // Create the invaders.
    var ranks = this.config.invaderRanks + 0.1 * limitLevel;
    var files = this.config.invaderFiles + 0.2 * limitLevel;
    var invaders = [];
    for(var rank = 0; rank < ranks; rank++) {
        for(var file = 0; file < files; file++) {
            invaders.push(new Invader(
                (game.width / 2) + ((files/2 - file) * 800 / files),
                (game.gameBounds.top + rank * 40), rank, file, 'Invader'
            ));
        }
    }
    this.invaders = invaders;
    this.invaderCurrentVelocity = this.invaderInitialVelocity;
    this.invaderVelocity = {x: -this.invaderInitialVelocity, y:0};
    this.invaderNextVelocity = null;
};

PlayState.prototype.update = function(game, updateTime) {

    // If the left or right arrow keys are pressed, move the ship. 
    if(this.ship.shipExplosiontState != this.SHIP_EXPLODES && game.pressedKeys[KEY_LEFT]) {
        this.ship.x -= this.shipSpeed * updateTime;
    }

    if(this.ship.shipExplosiontState != this.SHIP_EXPLODES && game.pressedKeys[KEY_RIGHT]) {
        this.ship.x += this.shipSpeed * updateTime;
    }

    if(this.ship.shipExplosiontState == this.SHIP_ALIVE && game.pressedKeys[KEY_SPACE]) {
        this.fireRocket();
    }

    // Update the ship explosion then moves to the refresh phase 
    if(this.ship.shipExplosiontState == this.SHIP_EXPLODES) {
        this.ship.timerTick++;
        
        if(this.ship.timerTick % 2 == 0) {
            if(this.ship.currentExplosionFrame < this.shipExplosiontStates.length) {
                this.ship.image.src = this.shipExplosiontStates[this.ship.currentExplosionFrame++]; 
            } else {
                this.ship.currentExplosionFrame = 0;
                this.ship.timerTick = 0;
                var imageIndex = window.localStorage.getItem('index');
                this.ship.image.src = ships[imageIndex];
                this.ship.shipExplosiontState = this.SHIP_REFRESHS;
                this.ship.x = game.width / 2 - this.ship.width / 2;
                this.ship.y = game.gameBounds.bottom - this.ship.height;
            }
        }
    }

    // Update the refreshing phase, then make the ship alive 
    if(this.ship.shipExplosiontState == this.SHIP_REFRESHS) {
        if(this.ship.timerTick <= 300) {
            this.ship.timerTick++;
            
            if(this.ship.timerTick % 10 == 0) {
                if(this.ship.refreshToogle) {
                    this.ship.refreshToogle = false;
                } else {
                    this.ship.refreshToogle = true;
                }
            }
        } else {
            this.ship.timerTick = 0;
            this.ship.refreshToogle = true;
            this.ship.shipExplosiontState = this.SHIP_ALIVE;
        }
    }

    // Keep the ship in bounds.
    if(this.ship.x < game.gameBounds.left) {
        this.ship.x = game.gameBounds.left;
    }
    if(this.ship.x > game.gameBounds.right) {
        this.ship.x = game.gameBounds.right;
    }

    // Move each bomb.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        bomb.y += updateTime * bomb.velocity;

        // If the rocket has gone off the screen remove it.
        if(bomb.y > this.height) {
            this.bombs.splice(i--, 1);
        }
    }

    // Move each rocket.
    for(i=0; i<this.rockets.length; i++) {
        var rocket = this.rockets[i];
        rocket.y -= updateTime * rocket.velocity;

        // increase the rocket phase interval to move the phase 
        rocket.phacesChangeInterval++;
        if (rocket.phacesChangeInterval % 3 == 0) {
            if (!rocket.srcImageX && rocket.srcImageX != 0 && !rocket.srcImageY && rocket.srcImageY != 0) {
                rocket.srcImageX = rocket.srcImageY = rocket.currentImageFrame = 0;
            } else {
                rocket.currentImageFrame = ++rocket.currentImageFrame % this.rocketImage.numOfFrames;
                rocket.srcImageY = rocket.currentImageFrame * (this.rocketImage.height / this.rocketImage.numOfFrames);   
            }
        }

        // If the rocket has gone off the screen remove it.
        if(rocket.y < 0) {
            this.rockets.splice(i--, 1);
        }
    }

    // Move the invaders.
    var hitLeft = false, hitRight = false, hitBottom = false;
    for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var newx = invader.x + this.invaderVelocity.x * updateTime;
        var newy = invader.y + this.invaderVelocity.y * updateTime;

        if(hitLeft == false && newx < game.gameBounds.left) {
            hitLeft = true;
        } else if(hitRight == false && newx > game.gameBounds.right) {
            hitRight = true;
        } else if(hitBottom == false && newy > game.gameBounds.bottom) {
            hitBottom = true;
        }

        if(!hitLeft && !hitRight && !hitBottom) {
            invader.x = newx;
            invader.y = newy;
        }
    }

    // Update invader velocities.
    if(this.invadersAreDropping) {
        this.invaderCurrentDropDistance += this.invaderVelocity.y * updateTime;
        if(this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
            this.invadersAreDropping = false;
            this.invaderVelocity = this.invaderNextVelocity;
            this.invaderCurrentDropDistance = 0;
        }
    }

    // If we've hit the left, move down then right.
    if(hitLeft) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
        this.invaderNextVelocity = {x: this.invaderCurrentVelocity, y:0};
        if (this.ship.shipExplosiontState == this.SHIP_ALIVE) {
            this.invadersAreDropping = true;
        } else { 
            this.invaderVelocity = this.invaderNextVelocity;
        }
    }

    // If we've hit the right, move down then left.
    if(hitRight) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
        this.invaderNextVelocity = {x: -this.invaderCurrentVelocity, y:0};
        if (this.ship.shipExplosiontState == this.SHIP_ALIVE) {
            this.invadersAreDropping = true;
        } else { 
            this.invaderVelocity = this.invaderNextVelocity;
        }
    }

    // If we've hit the bottom, it's game over.
    if(hitBottom) {
        this.lives = 0;
    }
    
    // Check for rocket/invader collisions.
    for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var bang = false;

        for(var j=0; j<this.rockets.length; j++){
            var rocket = this.rockets[j];

            if((rocket.x >= invader.x && rocket.x <= (invader.x + invader.width) ||
            (rocket.x + rocket.width) >= invader.x && (rocket.x + rocket.width) <= (invader.x + invader.width)) && 
            ((rocket.y >= invader.y && rocket.y <= (invader.y + invader.height)) || 
            (rocket.y + rocket.height) >= invader.y && (rocket.y + rocket.height) <= (invader.y + invader.height))) {
                
                // Remove the rocket, set 'bang' so we don't process this rocket again.
                this.rockets.splice(j--, 1);
                bang = true;
                game.score += this.config.pointsPerInvader;
                break;
            }
        }
        
        if(bang) {
            this.invaders.splice(i--, 1);
            game.sounds.playSound('bang');
        }
    }

    //  Find all of the front rank invaders.
    var frontRankInvaders = {};
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        //  If we have no invader for game file, or the invader
        //  for game file is futher behind, set the front
        //  rank invader to game one.
        if(!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
            frontRankInvaders[invader.file] = invader;
        }
    }

    //  Give each front rank invader a chance to drop a bomb.
    for(var i=0; i<this.config.invaderFiles; i++) {
        var invader = frontRankInvaders[i];
        if(!invader) continue;
        var chance = this.bombRate * updateTime;
        if(chance > Math.random()) {
            //  Fire!
            this.bombs.push(new Bomb(invader.x + invader.width / 2, invader.y + invader.height, 
                this.bombMinVelocity + Math.random()*(this.bombMaxVelocity - this.bombMinVelocity)));
        }
    }

    //  Check for bomb/ship collisions.
    if(this.ship.shipExplosiontState == this.SHIP_ALIVE) {
        for(var i=0; i<this.bombs.length; i++) {
            var bomb = this.bombs[i];
            if(bomb.x >= (this.ship.x - this.ship.width/2) && bomb.x <= (this.ship.x + this.ship.width/2) &&
                    bomb.y >= (this.ship.y - this.ship.height/2) && bomb.y <= (this.ship.y + this.ship.height/2)) {
                this.ship.shipExplosiontState = this.SHIP_EXPLODES;

                this.bombs.splice(i--, 1);
                game.lives--;
                game.sounds.playSound('explosion');
            }
        }
    }

    //  Check for invader/ship collisions.
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        if((invader.x + invader.width/2) > (this.ship.x - this.ship.width/2) && 
            (invader.x - invader.width/2) < (this.ship.x + this.ship.width/2) &&
            (invader.y + invader.height/2) > (this.ship.y - this.ship.height/2) &&
            (invader.y - invader.height/2) < (this.ship.y + this.ship.height/2)) {
            
            //  Dead by collision!
            game.lives = 0;
            game.sounds.playSound('explosion');
        }
    }

    //  Check for failure
    if(game.lives <= 0) {
        game.moveToState(new GameOverState());
    }

    //  Check for victory
    if(this.invaders.length === 0) {
        game.score += this.level * 50;
        game.level += 1;
        game.moveToState(new LevelIntroState(game.level));
    }
};

PlayState.prototype.draw = function(game, drawTime, canvasContext) {

    //  Clear the background.
    canvasContext.clearRect(0, 0, game.width, game.height);
    
    // Draw ship.
    if(this.ship.refreshToogle) { 
        canvasContext.drawImage(this.ship.image, this.ship.x, this.ship.y, this.ship.width, this.ship.height);
    }

    // Draw invaders.
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        canvasContext.drawImage(this.invaderImage, invader.x, invader.y, invader.width, invader.height);
    }

    // Draw bombs.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        canvasContext.drawImage(this.bombImage, bomb.x, bomb.y, bomb.width, bomb.height);
    }

    // Draw rockets.
    for(var i=0; i<this.rockets.length; i++) {
        var rocket = this.rockets[i];
        
        canvasContext.drawImage(this.rocketImage.image, rocket.srcImageX, rocket.srcImageY, this.rocketImage.width
            ,this.rocketImage.height / this.rocketImage.numOfFrames, rocket.x, rocket.y, rocket.width, rocket.height);
    }
    
    //  Draw info.
    var textYpos = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14/2;
    canvasContext.font="14px Arial";
    canvasContext.fillStyle = '#ffffff';
    var info = "Lives: " + game.lives;
    canvasContext.textAlign = "left";
    canvasContext.fillText(info, game.gameBounds.left, textYpos);
    info = "Score: " + game.score + ", Level: " + game.level;
    canvasContext.textAlign = "right";
    canvasContext.fillText(info, game.gameBounds.right, textYpos);
};

var html ="";
PlayState.prototype.keyDown = function (game, keyCode) {

    if (keyCode == KEY_SPACE) {
        //  Fire!
        this.fireRocket();
    }
    if (keyCode == KEY_PAUSE) {
        //  Push the pause state.
        var field = document.getElementById('gamecontainer');
        field.style.zIndex = 3;
        html = field.innerHTML;
        field.innerHTML="<h1 style='margin-top:25%'>Paused</h1><button id='quit' name='submit'"+"style='border: none;outline: none;height: 45px;"+
        "background:#696969;color: #fff;font-size: 25px;border-radius: 20px;'"+">Quit Game</button>";
        var quit = document.getElementById('quit');
        quit.addEventListener('click',quitGame);
        function quitGame(){
            window.location.href = "slidShow.html";
        }
        game.pushState(new PauseState());
    }
};
PlayState.prototype.keyUp = function(game, keyCode) {};

PlayState.prototype.fireRocket = function() {
    //  If we have no last rocket time, or the last rocket time 
    //  is older than the max rocket rate, we can fire.
    if(this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.rocketMaxFireRate))
    {
        //  Add a rocket.
        this.rockets.push(new Rocket(this.ship.x + this.ship.width / 2, this.ship.y + 20, this.config.rocketVelocity));
        this.lastRocketTime = (new Date()).valueOf();

        //  Play the 'shoot' sound.
        game.sounds.playSound('shoot');
    }
};

function PauseState() {}

PauseState.prototype.keyDown = function (game, keyCode) {

    if (keyCode == KEY_PAUSE) {
        //  Pop the pause state.
        var field = document.getElementById('gamecontainer');
        field.style.zIndex = -1;
        field.innerHTML=html;
        game.popState();
    }
};

PauseState.prototype.draw = function(game, updateTime, contextConvas) {

    // Clear the background.
    if(contextConvas){
    contextConvas.clearRect(0, 0, game.width, game.height);

    contextConvas.font="14px Arial";
    contextConvas.fillStyle = '#ffffff';
    contextConvas.textBaseline="middle";
    contextConvas.textAlign="center";
    contextConvas.fillText("Paused", game.width / 2, game.height/2);
    return;
    }
};

/*  
    Level Intro State

    The Level Intro state shows a 'Level X' message and
    a countdown for the level.
*/
function LevelIntroState(level) {
    this.level = level;
    this.countdownMessage = "3";
}

LevelIntroState.prototype.update = function(game, updateTime) {

    //  Update the countdown.
    if(this.countdown === undefined) {
        this.countdown = 3; // countdown from 3 secs
    }
    this.countdown -= updateTime;

    if(this.countdown < 2) { 
        this.countdownMessage = "2"; 
    }
    if(this.countdown < 1) { 
        this.countdownMessage = "1"; 
    } 
    if(this.countdown <= 0) {
        //  Move to the next level, popping this state.
        game.moveToState(new PlayState(game.config, this.level));
    }

};

LevelIntroState.prototype.draw = function(game, drawTime, canvasContext) {
    //  Clear the background.
    canvasContext.clearRect(0, 0, game.width, game.height);

    canvasContext.font="36px Arial";
    canvasContext.fillStyle = '#ffffff';
    canvasContext.textBaseline="middle"; 
    canvasContext.textAlign="center"; 
    canvasContext.fillText("Level " + this.level, game.width / 2, game.height/2);
    canvasContext.font="24px Arial";
    canvasContext.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 36);
    return;
};


/*
  Ship
*/
function Ship(x, y, shipExplosiontState) {
    this.width = 76;
    this.height = 76;
    this.x = x - this.width / 2;
    this.y = y - this.height;
    this.image = new Image();
    this.shipExplosiontState = shipExplosiontState;
    this.currentExplosionFrame = 0;
    this.timerTick = 0;
    this.refreshToogle = true;
}

/*
  Rocket
*/
function Rocket(motherShipX, motherShipY, velocity) {
    this.width = 48;
    this.height = 64;
    this.x = motherShipX - this.width / 2;
    this.y = motherShipY - this.height;
    this.velocity = velocity;
    this.phacesChangeInterval = 0;
    this.srcImageX;
    this.srcImageY;
    this.currentImageFrame;
}

/*
  Bomb
*/
function Bomb(x, y, velocity) {
    this.width = 18;
    this.height = 18;
    this.x = x - this.width / 2;
    this.y = y;
    this.velocity = velocity;
}
 
/*
  Invader 
*/
function Invader(x, y, rank, file, type) {
    this.x = x;
    this.y = y;
    this.rank = rank;
    this.file = file;
    this.type = type;
    this.width = 48;
    this.height = 48;
}

/*
  Rocket animation phases model 
*/
function RocketModel(image, numOfFrames) {
    this.image = image;
    this.width;
    this.height;
    this.numOfFrames = numOfFrames;
}

/*
    Sounds
*/
function Sounds() {

    //  The audio context.
    this.audioContext = null;

    //  The actual set of loaded sounds.
    this.sounds = {};
}

Sounds.prototype.init = function() {

    // Create the audio context, paying attention to webkit browsers.
    context = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new context();
    this.mute = false;
};

Sounds.prototype.loadSound = function(name, url) {

    //  Reference to ourselves for closures.
    var self = this;

    //  Create an entry in the sounds object.
    this.sounds[name] = null;

    //  Create an asynchronous request for the sound.
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
        self.audioContext.decodeAudioData(req.response, function(buffer) {
            self.sounds[name] = {buffer: buffer};
        });
    };
    try {
      req.send();
    } catch(e) {
      console.log("An exception occured getting sound the sound " + name + " this might be " +
         "because the page is running from the file system, not a webserver.");
      console.log(e);
    }
};

Sounds.prototype.playSound = function(name) {

    //  If we've not got the sound, don't bother playing it.
    if(this.sounds[name] === undefined || this.sounds[name] === null || this.mute === true) {
        return;
    }

    //  Create a sound source, set the buffer, connect to the speakers and play the sound.
    var source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name].buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
};