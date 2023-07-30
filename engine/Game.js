/**
 * Game.js
 * This is the main (high-level) file for execution of the orzentia game
 */

Game = {};

Game.start = function(){
    // nothing yet
    console.log("game start");
    Game.setInputHandlers();
    GameState.createNewGameState();
    SceneManager.loadScene("default");
};

Game.restart = function(){
    // nothing yet
};

Game.end = function(){
    // nothing yet
};

Game.setInputHandlers = function(){
    window.addEventListener("keydown", function(event){
        event.preventDefault();
        switch(event.key){
            // move up
            case "ArrowUp":
            // move down
            case "ArrowDown":
            // move left
            case "ArrowLeft":
            // move right
            case "ArrowRight":
            // Interact (Talk/Press/etc.)
            case "f":
            case "F":
            // light attack
            // simple slash (horizontal-arc)
            case "z":
            case "Z":
            // heavy attack (spin-attack) slower
            case "x":
            case "X":
            // magic attack
            case "c":
            case "C":
            // pause/unpause
            case "return":
            case "Return":
            case "enter":
            case "Enter":
                var length = GameState.activeKeys.filter(function(key){
                    return key === event.key;
                }).length;
                if (!length){
                    GameState.activeKeys.push(event.key);
                }
                console.log(GameState.activeKeys);
                break;
            default:
                break;
        }
    });

    window.addEventListener("keyup", function(event){
        event.preventDefault();
        switch(event.key){
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
            // Interact (Talk/Press/etc.)
            case "f":
            case "F":
            // light attack
            // simple slash (horizontal-arc)
            case "z":
            case "Z":
            // heavy attack (spin-attack) slower
            case "x":
            case "X":
            // magic attack
            case "c":
            case "C":
            // pause/unpause
            case "return":
            case "enter":
                GameState.activeKeys.splice(
                    GameState.activeKeys.indexOf(event.key),
                    1
                );
                console.log(GameState.activeKeys);
                break;
            default:
                break;
        }
    });
}

/**
 * Returns the calculated distance between two points
 * @param {Object} p1 - point 1 {x, y} 
 * @param {Object} p2 - point 2 {x, y}
 * @returns 
 */
Game.getDistanceBetweenPoints = function(p1, p2){
    return Math.sqrt(((p1.x - p2.x) * (p1.x - p2.x)) + ((p1.y - p2.y) * (p1.y - p2.y)));
};
