/**
 * This is the main file for execution of the orzentia game
 */

var Game = {};
var GameState = require("./engine/GameState");
var SceneManager = require("./engine/SceneManager");

/**
 * Prep asset loading, and begin initializing game start
 */
Game.initialize = function(){
    // nothing yet
    console.log("game start");
    SceneManager.loadScene("initial");
};

/**
 * Game START!!
 */

Game.initialize();