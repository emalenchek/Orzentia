/**
 * SceneManager.js
 */

// initialize scene manager object
var SceneManager = {};

// members //
SceneManager.availableScenes = {
    "default": {
        name: "default",
        description: "The default load scene of the game"
    }
};
SceneManager.activeScene = null;
SceneManager.sceneStack = [];

// tilemap constants;
SceneManager.CANVAS_WIDTH = 500;
SceneManager.CANVAS_HEIGHT = 500;
SceneManager.MAP_WIDTH = 20;
SceneManager.MAP_HEIGHT = 20;
SceneManager.TILE_WIDTH = 50;
SceneManager.TILE_HEIGHT = 50;

// {x, y, z}
// x: row tilemap value
// y: col tilemap value
// z: collision on

// collision value reference
// z === 0: collision off
// z === 1: collision on
SceneManager.backgroundTileMapArray = [
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]
];

// {x, y, z}
// x: row tilemap value
// y: col tilemap value
// z: collision on

// collision value reference
// z === 0: collision off
// z === 1: collision on
SceneManager.foregroundTileMapArray = [
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [6,0,1], [7,0,1], [8,0,1], [9,0,1], [10,0,1], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [6,1,1], [7,1,1], [8,1,1], [9,1,1], [10,1,1], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [6,2,1], [7,2,1], [8,2,1], [9,2,1], [10,2,1], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [6,3,1], [7,3,1], [8,3,1], [9,3,1], [10,3,1], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [6,4,1], [7,4,1], [8,4,1], [9,4,1], [10,4,1], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]
];

// This is the canvas element
SceneManager.canvasEl = document.getElementById("game-canvas");
SceneManager.canvasCtx = SceneManager.canvasEl.getContext("2d");

SceneManager.playerSpritesheet = document.getElementById("player-sprites");

var FPS = 30;
var FRAME_MIN_TIME = (1000/60) * (60 / FPS) - (1000/60) * 0.5;
SceneManager.PLAYER_WIDTH = 32;
SceneManager.PLAYER_HEIGHT = 32;
var PLAYER_COLOR = "rgb(200, 0, 0)";

// methods //

/**
 * Creates a new scene from a list of templates
 * @param {String} newScene - name of new scene to be created 
 * @returns 
 */
SceneManager.createScene = function(newScene){
    var scene = SceneManager.availableScenes[newScene];
    // set the active scene to the newly created scene
    SceneManager.activeScene = scene;
    // add the new scene to the scene stack
    SceneManager.sceneStack.push(scene);
    return scene;
};

/**
 * Adds a new scene to the scene stack and renders the scene
 * @param {String} newScene - Name of the scene to be loaded 
 */
SceneManager.loadScene = function(newScene){
    var scene = SceneManager.createScene(newScene);
    SceneManager.originCtxTransform = this.canvasCtx.getTransform();
    // load background based off currentState.player.location
    SceneManager.renderScene(scene);
    // load player
    SceneManager.loadPlayer();
};

/**
 * Renders the background textures from the tilemap to the context
 */
SceneManager.renderBackgroundTilemapToContext = function(){
    var tileMapImage = document.getElementById("world-sprites");
    for (var i = 0; i < this.MAP_WIDTH; i++){
        for (var j = 0; j < this.MAP_HEIGHT; j++){
            // The value of the current tile based on the tile array example
            var index = (i * this.MAP_WIDTH) + j;
            var xValue = SceneManager.backgroundTileMapArray[index][0];

            // setting this to 0 for now, until tileMapExample is made into 2D array
            var yValue = SceneManager.backgroundTileMapArray[index][1];

            // get the position coords for this tile
            var tileY = i * this.TILE_WIDTH;
            var tileX = j * this.TILE_HEIGHT;

            // Logic for drawing tiles from map to canvas
            SceneManager.canvasCtx.drawImage(
                tileMapImage,
                xValue * 16,
                yValue * 16,
                16,
                16,
                tileX,
                tileY,
                this.TILE_WIDTH,
                this.TILE_HEIGHT
            );
        }
    }
};

/**
 * Render the foreground textures from the tilemap to the context
 */
SceneManager.renderForegroundTilemapToContext = function(){
    var tileMapImage = document.getElementById("world-sprites");
    for (var i = 0; i < this.MAP_WIDTH; i++){
        for (var j = 0; j < this.MAP_HEIGHT; j++){
            // The value of the current tile based on the tile array example
            var index = (i * this.MAP_WIDTH) + j;
            var xValue = SceneManager.foregroundTileMapArray[index][0];

            // setting this to 0 for now, until tileMapExample is made into 2D array
            var yValue = SceneManager.foregroundTileMapArray[index][1];

            // get the position coords for this tile
            var tileY = i * this.TILE_WIDTH;
            var tileX = j * this.TILE_HEIGHT;

            // Logic for drawing tiles from map to canvas
            SceneManager.canvasCtx.drawImage(
                tileMapImage,
                xValue * 16,
                yValue * 16,
                16,
                16,
                tileX,
                tileY,
                this.TILE_WIDTH,
                this.TILE_HEIGHT
            );
        }
    }
};

/**
 * Render pause menu text
 */
SceneManager.renderPauseMenuText = function(){
    var pauseDetails = GUI.pauseMenuDetails;

    var playerX = GameState.currentState.player.location.x;
    var playerY = GameState.currentState.player.location.y;

    var posX = SceneManager.TILE_WIDTH * 2 + playerX;
    var posY = SceneManager.TILE_HEIGHT * 2 - playerY;

    this.canvasCtx.font = "32px " + pauseDetails.font;

    for (var i in pauseDetails.options){
        // text style
        this.canvasCtx.fillStyle = pauseDetails.foregroundColor;

        // render text
        this.canvasCtx.fillText(pauseDetails.options[i], posX, posY + (60 * Number(i)));

        var textWidth = this.canvasCtx.measureText(pauseDetails.options[i]).width;

        if (Number(i) === pauseDetails.cursorIndex){
            // underline this text to show user the active highlighted element
            this.canvasCtx.fillStyle = pauseDetails.foregroundColor;
            this.canvasCtx.fillRect(posX, posY + (60 * Number(i)) + 10, textWidth, 2);
        }
    }
};

/**
 * Render the pause menu
 */
SceneManager.renderPauseMenu = function(){
    
    var pauseDetails = GUI.pauseMenuDetails;

    var playerX = GameState.currentState.player.location.x;
    var playerY = GameState.currentState.player.location.y;

    var posX = SceneManager.TILE_WIDTH + playerX;
    var posY = SceneManager.TILE_HEIGHT - playerY;
    var width = pauseDetails.width;
    var height = pauseDetails.height;

    // want to clear the pause menu area
    this.canvasCtx.clearRect(posX, posY, width, height);
    this.canvasCtx.fillStyle = pauseDetails.backgroundColor;
    // draw the pause menu area
    this.canvasCtx.fillRect(posX, posY, width, height);

    // Populate pause menu with text
    SceneManager.renderPauseMenuText();
};

/**
 * Renders the scene object to the screen
 * @param {Scene} scene - scene object to be rendered 
 */
SceneManager.renderScene = function(scene){
    // nothing yet.. eventually we will use information from the scene to load in proper assets
    // and load data/update state of our game
    // but for now: we are just a square

    // if game is not paused
    if (!GameState.currentState.isPaused){
        // reset canvas
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.width, this.canvasCtx.height);

        SceneManager.renderBackgroundTilemapToContext();
        SceneManager.renderForegroundTilemapToContext();

        // using the player's location, 
        // we want to figure out the segment of the map to load
        var x = GameState.currentState.player.location.x;
        var y = GameState.currentState.player.location.y;

        // need to reset the canvas transform
        var transform = this.canvasCtx.getTransform();
        transform.e = -x;
        transform.f = y;
        this.canvasCtx.setTransform(transform);
    }
    else {
        // game is paused
        SceneManager.renderPauseMenu();
    }
};

/**
 * Get the actual coordinates with the player's true location value
 */
SceneManager.getTrueLocation = function(x, y){
    if (!x){
        x = 0;
    }
    if (!y){
        y = 0;
    }
    // x coordinate of player (need to subtract half the width as an offset to truly center)
    var trueX = (this.canvasEl.width / 2) - (SceneManager.PLAYER_WIDTH / 2);
    // y coordinate of player (need to subtract half the height as an offset to truly center)
    var trueY = (this.canvasEl.height / 2) - (SceneManager.PLAYER_HEIGHT / 2);
    return {
        "x": trueX + x,
        "y": trueY - y
    };
}

/**
 * Gets the rotation value for the player's orientation
 * Based on cardinal direction
 */
SceneManager.getPlayerOrientationValue = function(){
    var orientation = GameState.currentState.player.orientation;
    var rotation = 0;
    switch (orientation){
        case "N":
            rotation = 1;
            break;
        case "S":
            rotation = 0;
            break;
        case "E":
            rotation = 3;
            break;
        case "W":
            rotation = 2;
            break;
        default:
            break;
    };
    return rotation;
};

/**
 * Determines the active sprite data based on if player is moving,
 * and in what environment
 */
SceneManager.determineActivePlayerSprite = function(cycleLoop, cycleLoopIndex){
    if (!GameState.activeKeys.length){
        var rotation = SceneManager.getPlayerOrientationValue();
        return {
            "sx": 0,
            "sy": 18 * rotation,
            "sWidth": 16,
            "sHeight": 18,
        }
    }
    else {
        // Use the last registered movement key to decide the direction
        var activeMovement = GameState.activeKeys[GameState.activeKeys.length - 1];
        var data = {};
        switch (activeMovement){
            case "ArrowUp":
                GameState.currentState.player.orientation = "N";
                var rotation = SceneManager.getPlayerOrientationValue();
                data = {
                    "sx": 16 * cycleLoop[cycleLoopIndex],
                    "sy": 18 * rotation,
                    "sWidth": 16,
                    "sHeight": 18,
                    "rotation": rotation
                }
                break;
            case "ArrowDown":
                GameState.currentState.player.orientation = "S";
                var rotation = SceneManager.getPlayerOrientationValue();
                data = {
                    "sx": 16 * cycleLoop[cycleLoopIndex],
                    "sy": 18 * rotation,
                    "sWidth": 16,
                    "sHeight": 18,
                    "rotation": rotation
                }
                break;
            case "ArrowLeft":
                GameState.currentState.player.orientation = "W";
                var rotation = SceneManager.getPlayerOrientationValue();
                data = {
                    "sx": 16 * cycleLoop[cycleLoopIndex],
                    "sy": 18 * rotation,
                    "sWidth": 16,
                    "sHeight": 18,
                    "rotation": rotation
                }
                break;
            case "ArrowRight":
                GameState.currentState.player.orientation = "E";
                var rotation = SceneManager.getPlayerOrientationValue();
                data = {
                    "sx": 16 * cycleLoop[cycleLoopIndex],
                    "sy": 18 * rotation,
                    "sWidth": 16,
                    "sHeight": 18,
                    "rotation": rotation
                }
                break;
            default:
                var rotation = SceneManager.getPlayerOrientationValue();
                data = {
                    "sx": 16 * cycleLoop[cycleLoopIndex],
                    "sy": 18 * rotation,
                    "sWidth": 16,
                    "sHeight": 18,
                    "rotation": rotation
                }
                break;
        }
        return data;
    }
};

/**
 * A method that loads the player character onto the scene
 */
SceneManager.loadPlayer = function(cycleLoop, cycleLoopIndex, frameCount){
    // for now the player is just a square, 
    // and we want to center the character

    // player width
    var width = SceneManager.PLAYER_WIDTH;
    var height = SceneManager.PLAYER_HEIGHT;

    // x coordinate of player (need to subtract half the width as an offset to truly center)
    var x = (this.canvasEl.width / 2) - (SceneManager.PLAYER_WIDTH / 2);
    // y coordinate of player (need to subtract half the height as an offset to truly center)
    var y = (this.canvasEl.height / 2) - (SceneManager.PLAYER_HEIGHT / 2);

    var xOffset = GameState.currentState.player.location.x;
    var yOffset = GameState.currentState.player.location.y;

    var playerImage = document.getElementById("player-sprites");

    // Get the correct sprite data

    var spritesheetData = SceneManager.determineActivePlayerSprite(cycleLoop, cycleLoopIndex);

    // Draw image to canvas
    this.canvasCtx.drawImage(
        playerImage,
        spritesheetData.sx,
        spritesheetData.sy,
        spritesheetData.sWidth,
        spritesheetData.sHeight,
        x + xOffset,
        y - yOffset,
        width,
        height
    );
};

/**
 * Update the state of the current scene
 */
SceneManager.updateActiveScene = function(){
    // The last frame time noted
    var playerWalkCycleLoop = [1,0,2,0];
    var currentLoopIndex = 0;
    var frameCount = 0;
    var lastFrameTime = 0;

    var callback = function(time){
        frameCount++;
        if (time - lastFrameTime < FRAME_MIN_TIME){
            requestAnimationFrame(callback);
            return;
        }
        lastFrameTime = time;

        // update player's location if necessary
        if (GameState.activeKeys.length){
            GameState.updatePlayerLocation();
        }

        SceneManager.renderScene(SceneManager.activeScene);

        if (!GameState.currentState.isPaused){
            SceneManager.loadPlayer(playerWalkCycleLoop, currentLoopIndex, frameCount);
            
            // Need to check to see if any attacks to be rendered
            // will make contact with an enemy 
            GameState.checkAttackEnemyCollision()

            // Need to render all enemies onto the screen
            SceneManager.renderEnemies();

            // Need to render all projectiles
            SceneManager.renderAttackAnimations();
        }



        // reset frame count
        if (frameCount > 5){
            currentLoopIndex++;
            frameCount = 0;
        }
        // reset the loop index
        if (currentLoopIndex >= playerWalkCycleLoop.length){
            currentLoopIndex = 0;
        }

        requestAnimationFrame(callback);
    };
    requestAnimationFrame(callback);
};

/**
 * remove scene from scene stack and update activeScene
 */
SceneManager.removeTopScene = function(){
    var lastSceneIndex = SceneManager.sceneStack.length;
    SceneManager.sceneStack.pop();
    SceneManager.activeScene = SceneManager.sceneStack[lastSceneIndex];
};

/**
 * Renders all active attack animations to the screen
 */
SceneManager.renderAttackAnimations = function(){
    if (GameState.currentState.activeAttacks.length){
        // need to render any and all active attack animations
        var activeAttacks = GameState.currentState.activeAttacks;
        for (var i in activeAttacks){
            var attack = activeAttacks[i];
            
            // get true canvas location of the attack
            var trueLocation = SceneManager.getTrueLocation(
                attack.currentLocation.x, attack.currentLocation.y
            );
            var x = trueLocation.x;
            var y = trueLocation.y;

            if (attack.sprites){
                var activeSprite = attack.sprites[attack.spriteIndex];

                // setup image
                var spriteImage = new Image();
                spriteImage.src = activeSprite;

                var degreeRotation = 0;
                var posX = (attack.width / 2);
                var posY = 0;
                // rotate image if necessary
                switch (attack.orientation){
                    case "N":
                        degreeRotation = 270;
                        posX = -(attack.height / 2);
                        break;
                    case "W":
                        degreeRotation = 180;
                        posY = -(attack.width);
                        posX = -(attack.height / 2);
                        break;
                    case "S":
                        degreeRotation = 90;
                        posY = -(attack.width);
                        posX = (attack.height / 2);
                        break;
                    default:
                        break;
                }
            
                // need to rotate the whole context apparently
                this.canvasCtx.save();
                this.canvasCtx.translate(x, y);
                this.canvasCtx.rotate(degreeRotation * Math.PI / 180);

                // Draw image to canvas
                this.canvasCtx.drawImage(
                    spriteImage,
                    posX,
                    posY,
                    attack.width,
                    attack.height
                );

                this.canvasCtx.restore();

                // need to update location of projectile
                GameState.updateActiveAttack(attack);
            }
            else {
                // do nothing
                // may want to just render a red block or something
            }
        }
    }
};

/**
 * Render all spawned enemies to the screen
 */
SceneManager.renderEnemies = function(){
    if (GameState.currentState.spawnedEnemies.length > 0){
        // render each enemy to the canvas
        for (var i in GameState.currentState.spawnedEnemies){
            var enemy = GameState.currentState.spawnedEnemies[i];
            var spritesheetPath = enemy.spritesheet;

            var enemySprite = new Image();
            enemySprite.src = spritesheetPath;

            this.canvasCtx.drawImage(
                enemySprite,
                // x position spritesheet
                (enemy.spriteIndex % 3) * enemy.spriteWidth,
                // y position spritesheet
                (enemy.spriteIndex / 3) * enemy.spriteHeight,
                enemy.spriteWidth,
                enemy.spriteHeight,
                enemy.location.x,
                enemy.location.y,
                enemy.width,
                enemy.height
            );

            GameState.updateActiveEnemy(enemy);
        }
    }
};
