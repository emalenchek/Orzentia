/**
 * GameState.js
 */

// initialize game state object
var GameState = {};

GameState.newStateTemplate = {
    "start": null,
    "end": null,
    "description": "Game is currently in progress. No end-game criteria has been met yet.",
    "player": {
        // This will be where all information regarding the player is stored
        // Name, Health, Level(?), inventory, equipped, spells/abilities, etc.
        "health": 50,
        "level": 1,
        "experience": 0,
        "inventory": [],
        "equipment": {
            "weapon": {},
            "head": {},
            "chest": {},
            "legs": {},
            "feet": {}
        },
        // speed at which the PC can move
        "speed": 5,
        "currency": 0,
        // an x/y coordinate on the map
        "location": {
            x: 0,
            y: 0
        },
        // N,S,E,W (direction being faced)
        "orientation": "S",
        "spritesheetSource": "./assets/spritesheets/Green-Cap-Character-16x18.png",

        //, ... much more probably
    },
    // changes can and will happen to player data in an active game state
    "isActive": false
};

GameState.currentState = null;
GameState.activeKeys = [];

GameState.createNewGameState = function(){
    // create a copy of the new state template
    var state = JSON.parse(JSON.stringify(GameState.newStateTemplate));
    state.start = Date.now();
    // set currentState to the new state
    GameState.currentState = state;
    GameState.currentState.isActive = true;
    SceneManager.updateActiveScene();
};

GameState.updatePlayerLocation = function(){
    GameState.activeKeys.map(function(key){
        switch (key){
            case "ArrowUp":
                // move character up
                GameState.currentState.player.location.y +=
                    GameState.currentState.player.speed;
                break;
            case "ArrowDown":
                // move character up
                GameState.currentState.player.location.y -=
                    GameState.currentState.player.speed;
                break;
            case "ArrowRight":
                // move character up
                GameState.currentState.player.location.x +=
                    GameState.currentState.player.speed;
                break;
            case "ArrowLeft":
                // move character up
                GameState.currentState.player.location.x -=
                    GameState.currentState.player.speed;
                break;
            default:
                break;
        }
        return;
    })
};
