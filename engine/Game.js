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
    Game.clearInputHandlers();
    GameState.destroyGameState(GameState.currentState);
    SceneManager.displayMainMenu();
};

Game.clearInputHandlers = function(){
    window.removeEventListener("keydown", Game.keyDownHandler);
    window.removeEventListener("keyup", Game.keyUpHandler);
};

Game.keyDownHandler = function(event){
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
};

Game.keyUpHandler = function(event){
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
        // pause/unpause — include capitalised variants (browser emits "Enter")
        case "Return":
        case "Enter":
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
};

Game.setInputHandlers = function(){
    window.addEventListener("keydown", Game.keyDownHandler);
    window.addEventListener("keyup", Game.keyUpHandler);
    Game.initMobileControls();
};

/**
 * Wires each virtual on-screen button to the same activeKeys array used by
 * the keyboard handler. touchstart/mousedown push the mapped key string;
 * touchend/touchcancel/mouseup/mouseleave splice it back out — identical
 * behaviour to keydown/keyup.
 *
 * An IIFE is used inside the loop because Game.js is ES5-style (var).
 * Without it every iteration would close over the same `key` variable
 * (the last value assigned), so all buttons would map to 'f'.
 */
Game.initMobileControls = function() {
    var buttonKeyMap = {
        "btn-up":       "ArrowUp",
        "btn-down":     "ArrowDown",
        "btn-left":     "ArrowLeft",
        "btn-right":    "ArrowRight",
        "btn-magic":    "c",
        "btn-pause":    "Enter",
        "btn-light":    "z",
        "btn-heavy":    "x",
        "btn-interact": "f"
    };

    var ids = Object.keys(buttonKeyMap);

    for (var i = 0; i < ids.length; i++) {
        (function(id, key) {
            var el = document.getElementById(id);
            if (!el) { return; } // graceful: button absent (e.g. unit test context)

            /** Push key into activeKeys (deduplicated, mirrors keyDownHandler). */
            function onPress(event) {
                event.preventDefault();
                var alreadyActive = GameState.activeKeys.filter(function(k) {
                    return k === key;
                }).length;
                if (!alreadyActive) {
                    GameState.activeKeys.push(key);
                }
                el.classList.add("pressed");
            }

            /** Remove key from activeKeys (mirrors keyUpHandler). */
            function onRelease(event) {
                event.preventDefault();
                var idx = GameState.activeKeys.indexOf(key);
                if (idx !== -1) {
                    GameState.activeKeys.splice(idx, 1);
                }
                el.classList.remove("pressed");
            }

            // Touch events (mobile)
            el.addEventListener("touchstart",  onPress,   { passive: false });
            el.addEventListener("touchend",    onRelease, { passive: false });
            el.addEventListener("touchcancel", onRelease, { passive: false });

            // Mouse events (desktop / pointer device testing)
            el.addEventListener("mousedown",  onPress);
            el.addEventListener("mouseup",    onRelease);
            el.addEventListener("mouseleave", onRelease);
        }(ids[i], buttonKeyMap[ids[i]]));
    }
};

/**
 * Returns the calculated distance between two points
 * @param {Object} p1 - point 1 {x, y} 
 * @param {Object} p2 - point 2 {x, y}
 * @returns 
 */
Game.getDistanceBetweenPoints = function(p1, p2){
    return Math.sqrt(((p1.x - p2.x) * (p1.x - p2.x)) + ((p1.y - p2.y) * (p1.y - p2.y)));
};

// Obtained from Tiled map 8/7/23
Game.collisionsMap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 1053, 1053, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 1053, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1053, 0, 0, 0, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 0, 0, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 0, 0, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 1053, 0, 0, 0, 0, 1053, 0, 0, 0, 1053, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 1053, 1053, 0, 0, 0, 1053, 0, 0, 0, 1053, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 1053, 1053, 1053, 0, 1053, 0, 0, 0, 1053, 0, 0, 0,
    0, 0, 0, 0, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 0, 1053, 1053, 1053, 0, 0, 0, 1053, 1053, 1053, 1053,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 0, 0, 1053, 0, 0, 0, 1053, 0, 0, 1053,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 0, 0, 1053, 0, 0, 0, 1053, 0, 0, 1053,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 1053, 0, 0, 0, 1053, 1053, 1053, 1053,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 0, 1053, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 0, 1053, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 0, 1053, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 1053, 0, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 0, 0, 1053, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 0, 0, 1053, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1053, 1053, 1053, 1053, 1053, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// Game.convertSingleDimensionArrayToTwoDimension = function(array){
//     // 48 x 48 map
//     // This is visible in Tiled by seeing values when "resize map" is used
//     for (var i = 0; i < array.length; i+=48){
//         array.push(array.slice(i, 48 + i));
//     }
// };

// Game.collisionsMap = Game.convertSingleDimensionArrayToTwoDimension(Game.collisionsMap);