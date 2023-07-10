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

/**
 * On load of game, create new game state
 */
GameState.createNewGameState = function(){
    // create a copy of the new state template
    var state = JSON.parse(JSON.stringify(GameState.newStateTemplate));
    state.start = Date.now();
    // set currentState to the new state
    GameState.currentState = state;
    GameState.currentState.isActive = true;
    SceneManager.updateActiveScene();
};

/**
 * If movement is requested (and not inhibited by collision)
 * updates character's location within the current game state
 * (based on character's speed)
 */
GameState.updatePlayerLocation = function(){
    GameState.activeKeys.map(function(key){
        switch (key){
            case "ArrowUp":
                // need to peek at new location to see if available
                var newLocation = {
                    "x": GameState.currentState.player.location.x,
                    "y": GameState.currentState.player.location.y +
                        GameState.currentState.player.speed
                };
                if (GameState.isLocationAvailable(newLocation)){
                    // move character up
                    GameState.currentState.player.location.y +=
                    GameState.currentState.player.speed;
                }
                break;
            case "ArrowDown":
                // need to peek at new location to see if available
                var newLocation = {
                    "x": GameState.currentState.player.location.x,
                    "y": GameState.currentState.player.location.y -
                        GameState.currentState.player.speed
                };
                if (GameState.isLocationAvailable(newLocation)){
                    // move character down
                    GameState.currentState.player.location.y -=
                        GameState.currentState.player.speed;
                }
                break;
            case "ArrowRight":
                // need to peek at new location to see if available
                var newLocation = {
                    "x": GameState.currentState.player.location.x +
                        GameState.currentState.player.speed,
                    "y": GameState.currentState.player.location.y
                };
                if (GameState.isLocationAvailable(newLocation)){
                    // move character right
                    GameState.currentState.player.location.x +=
                        GameState.currentState.player.speed;
                }
                break;
            case "ArrowLeft":
                // need to peek at new location to see if available
                var newLocation = {
                    "x": GameState.currentState.player.location.x -
                        GameState.currentState.player.speed,
                    "y": GameState.currentState.player.location.y
                };
                if (GameState.isLocationAvailable(newLocation)){
                    // move character left
                    GameState.currentState.player.location.x -=
                        GameState.currentState.player.speed;
                }
                break;
            default:
                break;
        }
        return;
    })
};

/**
 * Checks the foreground tilemap to see if the intended location is available
 */
GameState.isLocationAvailable = function(newLocation){
    var x = newLocation.x;
    var y = newLocation.y

    // x coordinate of player (need to subtract half the width as an offset to truly center)
    var xCalc = (SceneManager.canvasEl.width / 2) - (SceneManager.PLAYER_WIDTH / 2);
    // y coordinate of player (need to subtract half the height as an offset to truly center)
    var yCalc = (SceneManager.canvasEl.height / 2) - (SceneManager.PLAYER_HEIGHT / 2);

    // use player location as offset (and the offset based on canvas size) to get trueX and trueY
    var trueX = (xCalc + x) - (SceneManager.TILE_WIDTH * ((SceneManager.canvasEl.width / 2) / 100));
    var trueY = (yCalc - y) + (SceneManager.TILE_HEIGHT * ((SceneManager.canvasEl.height / 2) / 100)) + SceneManager.TILE_HEIGHT;

    // ignore the remainder, as this should check the whole area associated with new location
    var tileXIndex = Math.floor(trueX / SceneManager.TILE_WIDTH);
    var tileYIndex = Math.floor(trueY / SceneManager.TILE_HEIGHT);

    var arrayIndex = (tileXIndex * SceneManager.MAP_WIDTH) + tileYIndex;

    // check to see if collision is set at this location - foreground tilemap
    if (SceneManager.foregroundTileMapArray[arrayIndex].length > 2){
        if (SceneManager.foregroundTileMapArray[arrayIndex][2] === 1){
            console.log("Movement blocked");
            return false;
        }
    }

    // check to see if collision is set at this location - background tilemap
    if (SceneManager.backgroundTileMapArray[arrayIndex].length > 2){
        if (SceneManager.backgroundTileMapArray[arrayIndex][2] === 1){
            console.log("Movement blocked");
            return false;
        }
    }
    return true;
}
