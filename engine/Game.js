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
        switch(event.key){
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
                GameState.activeKeys.push(event.key);
                break;
            default:
                break;
        }
    });

    window.addEventListener("keyup", function(event){
        switch(event.key){
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
                GameState.activeKeys.splice(
                    GameState.activeKeys.indexOf(event.key),
                    1
                );
                break;
            default:
                break;
        }
    });
}
