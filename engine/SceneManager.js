/**
 * SceneManager.js
 */

// initialize scene manager object
var SceneManager = {};

// members //
SceneManager.availableScenes = {
    "initial": {
        name: "initial",
        description: "The initial load scene of the game, (PRESS START)"
    }
};
SceneManager.activeScene = null;
SceneManager.sceneStack = [];

// This is the canvas element
SceneManager.canvasEl = document.getElementById("game-canvas");
SceneManager.canvasCtx = SceneManager.canvasEl.getContext("2d");

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
    SceneManager.renderScene(scene);
};

/**
 * Renders the scene object to the screen
 * @param {Scene} scene - scene object to be rendered 
 */
SceneManager.renderScene = function(scene){
    // nothing yet.. eventually we will use information from the scene to load in proper assets
    // and load data/update state of our game
    // but for now: we are just a square
    SceneManager.loadPlayer();
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

    // draw to screen
    this.canvasCtx.fillStyle = PLAYER_COLOR;
    this.canvasCtx.fillRect(x, y, width, height);
};

/**
 * remove scene from scene stack and update activeScene
 */
SceneManager.removeTopScene = function(){
    var lastSceneIndex = SceneManager.sceneStack.length;
    SceneManager.sceneStack.pop();
    SceneManager.activeScene = SceneManager.sceneStack[lastSceneIndex];
}
