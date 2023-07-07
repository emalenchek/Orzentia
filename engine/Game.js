/**
 * Game.js
 * This is the main (high-level) file for execution of the orzentia game
 */

Game = {};

Game.start = function(){
    // nothing yet
    console.log("game start");
    GameState.createNewGameState();
    SceneManager.loadScene("default");
};

Game.restart = function(){
    // nothing yet
};

Game.end = function(){
    // nothing yet
};