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
SceneManager.MAP_WIDTH = 10;
SceneManager.MAP_HEIGHT = 10;
SceneManager.TILE_WIDTH = 64;
SceneManager.TILE_HEIGHT = 64;

// first row of 16x16 tiles
SceneManager.exampleTileMapArray = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

// This is the canvas element
SceneManager.canvasEl = document.getElementById("game-canvas");
SceneManager.canvasCtx = SceneManager.canvasEl.getContext("2d");

SceneManager.playerSpritesheet = document.getElementById("player-sprites");

var FPS = 30;
var FRAME_MIN_TIME = (1000/60) * (60 / FPS) - (1000/60) * 0.5;
var PLAYER_WIDTH = 25;
var PLAYER_HEIGHT = 25;
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
 * Renders the scene object to the screen
 * @param {Scene} scene - scene object to be rendered 
 */
SceneManager.renderScene = function(scene){
    // nothing yet.. eventually we will use information from the scene to load in proper assets
    // and load data/update state of our game
    // but for now: we are just a square

    // reset canvas
    this.canvasCtx.clearRect(0, 0, this.canvasCtx.width, this.canvasCtx.height);

    // Load initial background
    // var background = this.canvasCtx.createLinearGradient(0, 0, 550, 550);
    // background.addColorStop(0, "blue");
    // background.addColorStop(1, "green");

    // // Fill with gradient
    // this.canvasCtx.fillStyle = background;
    // this.canvasCtx.fillRect(0, 0, 1000, 1000);

    var tileMapImage = document.getElementById("world-sprites");
    for (var i = 0; i < this.MAP_WIDTH; i++){
        for (var j = 0; j < this.MAP_HEIGHT; j++){
            // The value of the current tile based on the tile array example
            var index = (i * this.MAP_WIDTH) + j;
            var xValue = SceneManager.exampleTileMapArray[index];

            // setting this to 0 for now, until tileMapExample is made into 2D array
            var yValue = 0;

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

    // using the player's location, 
    // we want to figure out the segment of the map to load
    var x = GameState.currentState.player.location.x;
    var y = GameState.currentState.player.location.y;

    // need to reset the canvas transform
    var transform = this.canvasCtx.getTransform();
    transform.e = -x;
    transform.f = y;
    this.canvasCtx.setTransform(transform);
};

/**
 * Gets the rotation value for the player's orientation
 * Based on cardinal direction
 */
SceneManager.getPlayerRotationValueFromOrientation = function(){
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
        var rotation = SceneManager.getPlayerRotationValueFromOrientation();
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
                var rotation = SceneManager.getPlayerRotationValueFromOrientation();
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
                var rotation = SceneManager.getPlayerRotationValueFromOrientation();
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
                var rotation = SceneManager.getPlayerRotationValueFromOrientation();
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
                var rotation = SceneManager.getPlayerRotationValueFromOrientation();
                data = {
                    "sx": 16 * cycleLoop[cycleLoopIndex],
                    "sy": 18 * rotation,
                    "sWidth": 16,
                    "sHeight": 18,
                    "rotation": rotation
                }
                break;
            default:
                var rotation = SceneManager.getPlayerRotationValueFromOrientation();
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
    var width = PLAYER_WIDTH;
    var height = PLAYER_HEIGHT;

    // x coordinate of player (need to subtract half the width as an offset to truly center)
    var x = (this.canvasEl.width / 2) - (PLAYER_WIDTH / 2);
    // y coordinate of player (need to subtract half the height as an offset to truly center)
    var y = (this.canvasEl.height / 2) - (PLAYER_HEIGHT / 2);

    var xOffset = GameState.currentState.player.location.x;
    var yOffset = GameState.currentState.player.location.y;

    var playerImage = document.getElementById("player-sprites");

    // Get the correct sprite data

    if (!cycleLoop && !cycleLoopIndex && !frameCount){
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
    }
    else {
        if (frameCount > 15){
            var spritesheetData = SceneManager.determineActivePlayerSprite(cycleLoop, cycleLoopIndex);
            cycleLoopIndex++;
            frameCount = 0;

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
        }
    }
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
        SceneManager.loadPlayer(playerWalkCycleLoop, currentLoopIndex, frameCount);

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
