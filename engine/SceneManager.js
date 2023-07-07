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

// This is the canvas element
SceneManager.canvasEl = document.getElementById("game-canvas");
SceneManager.canvasCtx = SceneManager.canvasEl.getContext("2d");

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
    var background = this.canvasCtx.createLinearGradient(0, 0, 550, 550);
    background.addColorStop(0, "blue");
    background.addColorStop(1, "green");

    // Fill with gradient
    this.canvasCtx.fillStyle = background;
    this.canvasCtx.fillRect(0, 0, 1000, 1000);

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
 * A method that loads the player character onto the scene
 */
SceneManager.loadPlayer = function(){
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

    // draw to screen
    this.canvasCtx.fillStyle = PLAYER_COLOR;
    this.canvasCtx.fillRect(x + xOffset, y - yOffset, width, height);
};

/**
 * Update the state of the current scene
 */
SceneManager.updateActiveScene = function(){
    // The last frame time noted
    var lastFrameTime = 0;
    var callback = function(time){
        if (time - lastFrameTime < FRAME_MIN_TIME){
            requestAnimationFrame(callback);
            return;
        }
        lastFrameTime = time;

        if (GameState.activeKeys.length){
            GameState.updatePlayerLocation();
        }

        SceneManager.renderScene(SceneManager.activeScene);
        SceneManager.loadPlayer();

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
