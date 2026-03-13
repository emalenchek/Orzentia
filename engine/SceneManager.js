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
SceneManager.CANVAS_WIDTH = 500;
SceneManager.CANVAS_HEIGHT = 500;
SceneManager.MAP_WIDTH = 48;
SceneManager.MAP_HEIGHT = 48;
SceneManager.TILE_WIDTH = 16 * 2.5;
SceneManager.TILE_HEIGHT = 16 * 2.5;

SceneManager.canvasStartXOffset = -440;
SceneManager.canvasStartYOffset = -1120;

// This is the canvas element
SceneManager.canvasEl = document.getElementById("game-canvas");
SceneManager.canvasCtx = SceneManager.canvasEl.getContext("2d");

var FPS = 30;
var FRAME_MIN_TIME = (1000/60) * (60 / FPS) - (1000/60) * 0.5;
// Character dimensions: 16×24 native pixels at 2.5× scale = 40×60 rendered pixels,
// matching the tileset's 40 px tile width (16 px native × 2.5 scale).
SceneManager.PLAYER_WIDTH         = 40;
SceneManager.PLAYER_HEIGHT        = 60;
SceneManager.PLAYER_SPRITE_WIDTH  = 16;
SceneManager.PLAYER_SPRITE_HEIGHT = 24;

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

    SceneManager.formatCollisionArray();
    // load background based off currentState.player.location
    SceneManager.renderScene(scene);
    // load player
    SceneManager.loadPlayer();
};

// SceneManager.renderCollisionBlocks = function(){
//     for (var i in Game.collisionsMap){
//         for (var j in Game.collisionsMap){
//             if (Game.collisionsMap[i][j] !== 0){
//                 // render a black block at this index
//                 var x = j * SceneManager.TILE_WIDTH;
//                 var y = i * SceneManager.TILE_HEIGHT;
//                 var width = SceneManager.TILE_WIDTH;
//                 var height = SceneManager.TILE_HEIGHT;
//                 SceneManager.canvasCtx.fillStyle = "black";
//                 SceneManager.canvasCtx.fillRect(x + SceneManager.canvasStartXOffset, y + SceneManager.canvasStartYOffset,width,height);
//             }
//         }
//     }
// };

SceneManager.formatCollisionArray = function(){
    var collisionArray = [];
    GameState.collisionsLookup = {};
    
    for (var i = 0; i < SceneManager.MAP_HEIGHT; i++){
        var newCollisionArray = [];
        for (var j = 0; j < SceneManager.MAP_WIDTH; j++){
            var index = i * SceneManager.MAP_HEIGHT + j;
            if (Game.collisionsMap[index] !==  0){
                // render blackBox
                GameState.collisionsLookup[index] = Game.collisionsMap[index];
            }
            newCollisionArray.push(Game.collisionsMap[index]);
        }
        collisionArray.push(newCollisionArray);
    }
    Game.collisionsMap = collisionArray;
};

SceneManager.renderWorldBackgroundImageToContext = function(){
    var worldMapImage = document.getElementById("world-image");
    SceneManager.canvasCtx.drawImage(
        worldMapImage,
        SceneManager.canvasStartXOffset,
        SceneManager.canvasStartYOffset
    );
};

// /**
//  * Image the background textures from the tilemap to the context
//  */
// SceneManager.renderBackgroundTilemapToContext = function(){
//     var tileMapImage = document.getElementById("world-sprites");
//     for (var i = 0; i < this.MAP_WIDTH; i++){
//         for (var j = 0; j < this.MAP_HEIGHT; j++){
//             // The value of the current tile based on the tile array example
//             var index = (i * this.MAP_WIDTH) + j;
//             var xValue = SceneManager.backgroundTileMapArray[index][0];

//             // setting this to 0 for now, until tileMapExample is made into 2D array
//             var yValue = SceneManager.backgroundTileMapArray[index][1];

//             // get the position coords for this tile
//             var tileY = i * this.TILE_WIDTH;
//             var tileX = j * this.TILE_HEIGHT;

//             // Logic for drawing tiles from map to canvas
//             SceneManager.canvasCtx.drawImage(
//                 tileMapImage,
//                 xValue * 16,
//                 yValue * 16,
//                 16,
//                 16,
//                 tileX,
//                 tileY,
//                 this.TILE_WIDTH,
//                 this.TILE_HEIGHT
//             );
//         }
//     }
// };

// /**
//  * Render the foreground textures from the tilemap to the context
//  */
// SceneManager.renderForegroundTilemapToContext = function(){
//     var tileMapImage = document.getElementById("world-sprites");
//     for (var i = 0; i < this.MAP_WIDTH; i++){
//         for (var j = 0; j < this.MAP_HEIGHT; j++){
//             // The value of the current tile based on the tile array example
//             var index = (i * this.MAP_WIDTH) + j;
//             var xValue = SceneManager.foregroundTileMapArray[index][0];

//             // setting this to 0 for now, until tileMapExample is made into 2D array
//             var yValue = SceneManager.foregroundTileMapArray[index][1];

//             // get the position coords for this tile
//             var tileY = i * this.TILE_WIDTH;
//             var tileX = j * this.TILE_HEIGHT;

//             // Logic for drawing tiles from map to canvas
//             SceneManager.canvasCtx.drawImage(
//                 tileMapImage,
//                 xValue * 16,
//                 yValue * 16,
//                 16,
//                 16,
//                 tileX,
//                 tileY,
//                 this.TILE_WIDTH,
//                 this.TILE_HEIGHT
//             );
//         }
//     }
// };

/**
 * Render pause menu items onto the already-drawn box.
 * @param {Number} boxX - canvas x of the box top-left (world-space, compensated)
 * @param {Number} boxY - canvas y of the box top-left (world-space, compensated)
 */
SceneManager.renderPauseMenuText = function(boxX, boxY){
    var p = GUI.pauseMenuDetails;
    var pad = p.padding;

    // title
    this.canvasCtx.fillStyle = p.borderColor;
    this.canvasCtx.font = p.titleFontSize + "px " + p.font;
    var titleWidth = this.canvasCtx.measureText(p.title).width;
    var titleX = boxX + (p.width - titleWidth) / 2;
    this.canvasCtx.fillText(p.title, titleX, boxY + pad + p.titleFontSize);

    // separator line beneath title
    this.canvasCtx.fillStyle = p.borderColor;
    this.canvasCtx.fillRect(
        boxX + pad,
        boxY + pad + p.titleFontSize + 6,
        p.width - pad * 2,
        1
    );

    // menu items — ">" cursor prefix for selected item, spaces for others
    var itemStartY = boxY + pad + p.titleFontSize + 6 + pad;
    this.canvasCtx.font = p.itemFontSize + "px " + p.font;

    for (var i = 0; i < p.options.length; i++){
        var isSelected = (i === p.cursorIndex);
        this.canvasCtx.fillStyle = isSelected ? p.borderColor : p.foregroundColor;
        var prefix = isSelected ? "> " : "  ";
        this.canvasCtx.fillText(prefix + p.options[i], boxX + pad, itemStartY + (i * p.itemSpacing));
    }

    // hint at the bottom
    this.canvasCtx.fillStyle = p.borderColor;
    this.canvasCtx.font = "10px " + p.font;
    var hint = "[Z] Select  [X] Close";
    var hintWidth = this.canvasCtx.measureText(hint).width;
    this.canvasCtx.fillText(hint, boxX + (p.width - hintWidth) / 2, boxY + p.height - pad);
};

/**
 * Render the pause menu — a screen-fixed overlay styled to match the
 * furnace-world aesthetic (ash-black background, amber border, parchment text).
 * Compensates for the world-scroll canvas transform the same way renderDialogueBox does.
 */
SceneManager.renderPauseMenu = function(){
    var p = GUI.pauseMenuDetails;
    var playerX = GameState.currentState.player.location.x;
    var playerY = GameState.currentState.player.location.y;

    // canvas transform is (e = -playerX, f = playerY); compensate to land at
    // fixed screen position (p.screenX, p.screenY)
    var boxX = p.screenX + playerX;
    var boxY = p.screenY - playerY;

    // ash-black fill
    this.canvasCtx.fillStyle = p.backgroundColor;
    this.canvasCtx.fillRect(boxX, boxY, p.width, p.height);

    // amber outer border
    this.canvasCtx.strokeStyle = p.borderColor;
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeRect(boxX, boxY, p.width, p.height);

    // inner border inset by 4px for a double-frame effect
    this.canvasCtx.strokeStyle = p.borderColor;
    this.canvasCtx.lineWidth = 1;
    this.canvasCtx.globalAlpha = 0.4;
    this.canvasCtx.strokeRect(boxX + 4, boxY + 4, p.width - 8, p.height - 8);
    this.canvasCtx.globalAlpha = 1.0;

    SceneManager.renderPauseMenuText(boxX, boxY);
};

/**
 * Renders the scene object to the screen
 * @param {Scene} scene - scene object to be rendered 
 */
SceneManager.renderScene = function(scene){
    // if game is active
    if (GameState.currentState.isActive){
        // reset canvas
        this.canvasCtx.clearRect(0, 0, this.canvasCtx.width, this.canvasCtx.height);

        // SceneManager.renderBackgroundTilemapToContext();
        SceneManager.renderWorldBackgroundImageToContext();

        // SceneManager.renderCollisionBlocks();

        // SceneManager.renderForegroundTilemapToContext();

        // using the player's location, 
        // we want to figure out the segment of the map to load
        var x = GameState.currentState.player.location.x;
        var y = GameState.currentState.player.location.y;

        // need to reset the canvas transform
        var transform = this.canvasCtx.getTransform();
        transform.e = -x;
        transform.f = y;
        this.canvasCtx.setTransform(transform);
    }
    else if (GameState.currentState.isGameOver){
        // game over
        SceneManager.displayGameOverScreen();
    }
    else if (GameState.currentState.isPaused){
        // game is paused
        SceneManager.renderPauseMenu();
    }
};

/**
 * Get the actual coordinates with the player's true location value
 */
SceneManager.getTrueLocation = function(x, y){
    if (!x){
        x = 0;
    }
    if (!y){
        y = 0;
    }
    // x coordinate of player (need to subtract half the width as an offset to truly center)
    var trueX = (this.canvasEl.width / 2) - (SceneManager.PLAYER_WIDTH / 2);
    // y coordinate of player (need to subtract half the height as an offset to truly center)
    var trueY = (this.canvasEl.height / 2) - (SceneManager.PLAYER_HEIGHT / 2);
    return {
        "x": trueX + x,
        "y": trueY - y
    };
}

/**
 * Determines the active sprite data based on if player is moving,
 * and in what environment
 */
SceneManager.determineActivePlayerSprite = function(cycleLoop, cycleLoopIndex){
    if (!GameState.activeKeys.length){
        GameState.updatePlayerOrientationValue();
        var rotation = GameState.currentState.player.rotation;
        return {
            "sx": SceneManager.PLAYER_SPRITE_WIDTH * rotation,
            "sy": SceneManager.PLAYER_SPRITE_HEIGHT * 0,
            "sWidth": SceneManager.PLAYER_SPRITE_WIDTH,
            "sHeight": SceneManager.PLAYER_SPRITE_HEIGHT,
            "rotation": rotation
        }
    }
    else {
        // Use the last registered movement key to decide the direction
        var activeMovement = GameState.activeKeys[GameState.activeKeys.length - 1];
        var data = {};

        var cycleValue = cycleLoop[cycleLoopIndex];

        switch (activeMovement){
            case "ArrowUp":
                GameState.currentState.player.orientation = "N";
                GameState.updatePlayerOrientationValue();
                var rotation = GameState.currentState.player.rotation;
                data = {
                    "sx": SceneManager.PLAYER_SPRITE_WIDTH * rotation,
                    "sy": SceneManager.PLAYER_SPRITE_HEIGHT * cycleValue,
                    "sWidth": SceneManager.PLAYER_SPRITE_WIDTH,
                    "sHeight": SceneManager.PLAYER_SPRITE_HEIGHT,
                    "rotation": rotation
                }
                break;
            case "ArrowDown":
                GameState.currentState.player.orientation = "S";
                GameState.updatePlayerOrientationValue();
                var rotation = GameState.currentState.player.rotation;
                data = {
                    "sx": SceneManager.PLAYER_SPRITE_WIDTH * rotation,
                    "sy": SceneManager.PLAYER_SPRITE_HEIGHT * cycleValue,
                    "sWidth": SceneManager.PLAYER_SPRITE_WIDTH,
                    "sHeight": SceneManager.PLAYER_SPRITE_HEIGHT,
                    "rotation": rotation
                }
                break;
            case "ArrowLeft":
                GameState.currentState.player.orientation = "W";
                GameState.updatePlayerOrientationValue();
                var rotation = GameState.currentState.player.rotation;
                data = {
                    "sx": SceneManager.PLAYER_SPRITE_WIDTH * rotation,
                    "sy": SceneManager.PLAYER_SPRITE_HEIGHT * cycleValue,
                    "sWidth": SceneManager.PLAYER_SPRITE_WIDTH,
                    "sHeight": SceneManager.PLAYER_SPRITE_HEIGHT,
                    "rotation": rotation
                }
                break;
            case "ArrowRight":
                GameState.currentState.player.orientation = "E";
                GameState.updatePlayerOrientationValue();
                var rotation = GameState.currentState.player.rotation;
                data = {
                    "sx": SceneManager.PLAYER_SPRITE_WIDTH * rotation,
                    "sy": SceneManager.PLAYER_SPRITE_HEIGHT * cycleValue,
                    "sWidth": SceneManager.PLAYER_SPRITE_WIDTH,
                    "sHeight": SceneManager.PLAYER_SPRITE_HEIGHT,
                    "rotation": rotation
                }
                break;
            default:
                GameState.updatePlayerOrientationValue();
                var rotation = GameState.currentState.player.rotation;
                data = {
                    "sx": SceneManager.PLAYER_SPRITE_WIDTH * rotation,
                    "sy": SceneManager.PLAYER_SPRITE_HEIGHT * 0,
                    "sWidth": SceneManager.PLAYER_SPRITE_WIDTH,
                    "sHeight": SceneManager.PLAYER_SPRITE_HEIGHT,
                    "rotation": rotation
                }
                break;
        }
        return data;
    }
};

/**
 * Render the main menu text
 */
SceneManager.renderMainMenuText = function(){
    var mainMenuDetails = GUI.mainMenuDetails;

    var playerX = GameState.currentState.player.location.x;
    var playerY = GameState.currentState.player.location.y;

    var posX = SceneManager.TILE_WIDTH * 2 + playerX;
    var posY = SceneManager.TILE_HEIGHT * 2 - playerY;

    this.canvasCtx.font = "32px " + mainMenuDetails.font;

    for (var i in mainMenuDetails.options){
        // text style
        this.canvasCtx.fillStyle = mainMenuDetails.foregroundColor;

        // render text
        this.canvasCtx.fillText(mainMenuDetails.options[i], posX, posY + (60 * Number(i)));

        var textWidth = this.canvasCtx.measureText(mainMenuDetails.options[i]).width;

        if (Number(i) === mainMenuDetails.cursorIndex){
            // underline this text to show user the active highlighted element
            this.canvasCtx.fillStyle = mainMenuDetails.foregroundColor;
            this.canvasCtx.fillRect(posX, posY + (60 * Number(i)) + 10, textWidth, 2);
        }
    }
};

/**
 * Render the main menu screen
 */
SceneManager.displayMainMenu = function(){
    // nothing yet

    // render default black background for canvas
    // with menu options corresponding to the main menu    
};

/**
 * Resolves the player's current facing direction and walk-frame index
 * from the active input and walk-cycle state.
 * @param {Array}  cycleLoop      - Walk cycle frame index array e.g. [2,0,3,0]
 * @param {number} cycleLoopIndex - Current position in the cycle loop
 * @returns {{ direction: string, walkFrame: number }}
 */
SceneManager.determinePlayerAnimState = function(cycleLoop, cycleLoopIndex){
    var direction = GameState.currentState.player.orientation || "S";
    var walkFrame = 0;

    if (!GameState.activeKeys.length){
        GameState.updatePlayerOrientationValue();
        return { direction: direction, walkFrame: 0 };
    }

    var activeMovement = GameState.activeKeys[GameState.activeKeys.length - 1];
    switch (activeMovement){
        case "ArrowUp":
            GameState.currentState.player.orientation = "N";
            direction = "N";
            break;
        case "ArrowDown":
            GameState.currentState.player.orientation = "S";
            direction = "S";
            break;
        case "ArrowLeft":
            GameState.currentState.player.orientation = "W";
            direction = "W";
            break;
        case "ArrowRight":
            GameState.currentState.player.orientation = "E";
            direction = "E";
            break;
        default:
            break;
    }
    GameState.updatePlayerOrientationValue();
    walkFrame = cycleLoop[cycleLoopIndex] || 0;
    return { direction: direction, walkFrame: walkFrame };
};

/**
 * Loads the player character onto the scene using the programmatic
 * pixel-art renderer (CharacterSprites.renderCharacter).
 * @param {Array}  cycleLoop      - Walk cycle frame index array
 * @param {number} cycleLoopIndex - Current position in the cycle
 */
SceneManager.loadPlayer = function(cycleLoop, cycleLoopIndex){
    // x coordinate of player — subtract half the width to truly centre
    var x = (this.canvasEl.width  / 2) - (SceneManager.PLAYER_WIDTH  / 2);
    // y coordinate of player — subtract half the height to truly centre
    var y = (this.canvasEl.height / 2) - (SceneManager.PLAYER_HEIGHT / 2);

    var xOffset = GameState.currentState.player.location.x;
    var yOffset = GameState.currentState.player.location.y;

    var animState = SceneManager.determinePlayerAnimState(cycleLoop, cycleLoopIndex);

    CharacterSprites.renderCharacter(
        this.canvasCtx,
        x + xOffset,
        y - yOffset,
        GameState.currentState.player.appearance,
        animState.direction,
        animState.walkFrame
    );
};

/**
 * Render the game over menu text
 */
SceneManager.renderGameOverMenuText = function(){
    var gameOverDetails = GUI.gameOverMenuDetails;

    var playerX = GameState.currentState.player.location.x;
    var playerY = GameState.currentState.player.location.y;

    var posX = SceneManager.TILE_WIDTH * 2 + playerX;
    var posY = SceneManager.TILE_HEIGHT * 2 - playerY;

    this.canvasCtx.font = "32px " + gameOverDetails.font;

    for (var i in gameOverDetails.options){
        // text style
        this.canvasCtx.fillStyle = gameOverDetails.foregroundColor;

        // render text
        this.canvasCtx.fillText(gameOverDetails.options[i], posX, posY + (60 * Number(i)));

        var textWidth = this.canvasCtx.measureText(gameOverDetails.options[i]).width;

        if (Number(i) === gameOverDetails.cursorIndex){
            // underline this text to show user the active highlighted element
            this.canvasCtx.fillStyle = gameOverDetails.foregroundColor;
            this.canvasCtx.fillRect(posX, posY + (60 * Number(i)) + 10, textWidth, 2);
        }
    }
};

/**
 * Render the game over screen
 */
SceneManager.displayGameOverScreen = function(){
    var gameOverDetails = GUI.gameOverMenuDetails;

    var playerX = GameState.currentState.player.location.x;
    var playerY = GameState.currentState.player.location.y;

    var posX = SceneManager.TILE_WIDTH + playerX;
    var posY = SceneManager.TILE_HEIGHT - playerY;
    var width = gameOverDetails.width;
    var height = gameOverDetails.height;

    // want to clear the pause menu area
    this.canvasCtx.clearRect(posX, posY, width, height);
    this.canvasCtx.fillStyle = gameOverDetails.backgroundColor;
    // draw the pause menu area
    this.canvasCtx.fillRect(posX, posY, width, height);

    // Populate pause menu with text
    SceneManager.renderGameOverMenuText();
};

/**
 * Splits a dialogue string into lines that fit within maxWidth pixels.
 * Must be called after setting the canvas font so measureText is accurate.
 * @param {String} text - the dialogue string to wrap
 * @param {Number} maxWidth - maximum pixel width per line
 * @returns {Array} array of line strings
 */
SceneManager.wrapDialogueText = function(text, maxWidth){
    var words = text.split(' ');
    var lines = [];
    var currentLine = '';

    for (var i = 0; i < words.length; i++){
        var testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
        var testWidth = this.canvasCtx.measureText(testLine).width;
        if (testWidth > maxWidth && currentLine){
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine){ lines.push(currentLine); }
    return lines;
};

/**
 * Renders all NPCs in the current area as pixel-art characters.
 * Draws an interaction prompt above any NPC within range of the player.
 */
SceneManager.renderNpcs = function(){
    var npcs = GameState.currentState.spawnedNpcs;
    if (!npcs || !npcs.length){ return; }

    var playerLoc = GameState.currentState.player.location;
    var playerTrueLoc = SceneManager.getTrueLocation(playerLoc.x, playerLoc.y);

    for (var i = 0; i < npcs.length; i++){
        var npc = npcs[i];

        // Draw NPC as pixel-art character facing south (idle)
        CharacterSprites.renderCharacter(
            this.canvasCtx,
            npc.location.x,
            npc.location.y,
            npc.appearance,
            "S",
            0
        );

        // name label beneath the NPC
        this.canvasCtx.font = "10px " + GUI.dialogueBoxDetails.font;
        this.canvasCtx.fillStyle = "white";
        this.canvasCtx.fillText(
            npc.name,
            npc.location.x,
            npc.location.y + npc.height + 12
        );

        // show [F] prompt when player is in range and no dialogue is open
        var dist = Game.getDistanceBetweenPoints(playerTrueLoc, npc.location);
        if (dist <= npc.interactionRange && !GameState.currentState.activeDialogue){
            this.canvasCtx.fillStyle = "yellow";
            this.canvasCtx.font = "bold 14px " + GUI.dialogueBoxDetails.font;
            this.canvasCtx.fillText(
                "[F]",
                npc.location.x + (npc.width / 2) - 10,
                npc.location.y - 6
            );
        }
    }
};

/**
 * Renders the JRPG-style dialogue box anchored to the bottom of the screen.
 * Compensates for the canvas world-scroll transform so the box stays at a
 * fixed visual position regardless of the player's world location.
 */
SceneManager.renderDialogueBox = function(){
    var dialogue = GameState.currentState.activeDialogue;
    if (!dialogue){ return; }

    var box = GUI.dialogueBoxDetails;
    var playerX = GameState.currentState.player.location.x;
    var playerY = GameState.currentState.player.location.y;

    // canvas transform is (e = -playerX, f = playerY); to land at fixed screen
    // position (box.screenX, box.screenY) we draw at:
    var boxX = box.screenX + playerX;
    var boxY = box.screenY - playerY;
    var pad = box.padding;

    // background
    this.canvasCtx.fillStyle = box.backgroundColor;
    this.canvasCtx.fillRect(boxX, boxY, box.width, box.height);

    // border
    this.canvasCtx.strokeStyle = box.borderColor;
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeRect(boxX, boxY, box.width, box.height);

    // NPC name header
    this.canvasCtx.fillStyle = box.foregroundColor;
    this.canvasCtx.font = box.nameFontSize + "px " + box.font;
    this.canvasCtx.fillText(dialogue.npc.name, boxX + pad, boxY + pad + box.nameFontSize);

    // separator line
    this.canvasCtx.fillRect(
        boxX + pad,
        boxY + pad + box.nameFontSize + 4,
        box.width - pad * 2,
        1
    );

    // word-wrapped dialogue text
    var pageText = dialogue.npc.dialogue[dialogue.pageIndex];
    this.canvasCtx.font = box.textFontSize + "px " + box.font;
    var lines = SceneManager.wrapDialogueText(pageText, box.width - pad * 2);
    var textStartY = boxY + pad + box.nameFontSize + 4 + pad;
    var lineHeight = box.textFontSize + 5;

    for (var i = 0; i < lines.length; i++){
        this.canvasCtx.fillText(lines[i], boxX + pad, textStartY + (i * lineHeight));
    }

    // advance indicator when more pages remain
    if (dialogue.pageIndex < dialogue.npc.dialogue.length - 1){
        this.canvasCtx.fillStyle = box.foregroundColor;
        this.canvasCtx.font = "bold " + box.textFontSize + "px " + box.font;
        this.canvasCtx.fillText(
            box.advanceIndicator,
            boxX + box.width - pad - 8,
            boxY + box.height - pad
        );
    }
};

/**
 * Update the state of the current scene
 */
SceneManager.updateActiveScene = function(){
    // The last frame time noted
    var playerWalkCycleLoop = [2, 0, 3, 0];
    var currentLoopIndex = 0;
    var frameCount = 0;
    // player orientation default
    var lastFrameTime = 0;

    var callback = function(time){
        if (!GameState.currentState){
            // Game has ended
            return;
        }

        frameCount++;
        if (time - lastFrameTime < FRAME_MIN_TIME){
            requestAnimationFrame(callback);
            return;
        }
        lastFrameTime = time;

        // update player's location if necessary
        if (GameState.currentState.isActive){
            if (GameState.activeKeys.length){
                GameState.updatePlayerLocation();
            }
        }
        else if (GameState.currentState.activeMenu){
            var menu = GameState.currentState.activeMenu;
            if (GameState.activeKeys.length){
                GameState.registerMenuInputHandlers(menu);
            }
        }

        SceneManager.renderScene(SceneManager.activeScene);

        if (GameState.currentState.isActive){
            GameState.updatePlayerState();

            SceneManager.loadPlayer(playerWalkCycleLoop, currentLoopIndex, frameCount);
            
            // Need to check to see if any attacks to be rendered
            // will make contact with an enemy 
            GameState.checkAttackEnemyCollision()

            // Need to render all enemies onto the screen
            SceneManager.renderEnemies();

            // Need to render all projectiles
            SceneManager.renderAttackAnimations();

            // Render NPCs and interaction prompts
            SceneManager.renderNpcs();

            // Render dialogue box on top when a conversation is active
            if (GameState.currentState.activeDialogue){
                SceneManager.renderDialogueBox();
            }
        }



        // reset frame count
        if (frameCount > 5){
            currentLoopIndex++;
            frameCount = 0;
        }
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

/**
 * Renders all active attack animations to the screen
 */
SceneManager.renderAttackAnimations = function(){
    if (GameState.currentState.activeAttacks.length){
        // need to render any and all active attack animations
        var activeAttacks = GameState.currentState.activeAttacks;
        for (var i in activeAttacks){
            var attack = activeAttacks[i];
            
            // get true canvas location of the attack
            var trueLocation = SceneManager.getTrueLocation(
                attack.currentLocation.x, attack.currentLocation.y
            );
            var x = trueLocation.x;
            var y = trueLocation.y;

            if (attack.sprites){
                var activeSprite = attack.sprites[attack.spriteIndex];

                // setup image
                var spriteImage = new Image();
                spriteImage.src = activeSprite;

                var degreeRotation = 0;
                var posX = (attack.width / 2);
                var posY = 0;
                // rotate image if necessary
                switch (attack.orientation){
                    case "N":
                        degreeRotation = 270;
                        posX = -(attack.height / 2);
                        break;
                    case "W":
                        degreeRotation = 180;
                        posY = -(attack.width);
                        posX = -(attack.height / 2);
                        break;
                    case "S":
                        degreeRotation = 90;
                        posY = -(attack.width);
                        posX = (attack.height / 2);
                        break;
                    default:
                        break;
                }
            
                // need to rotate the whole context apparently
                this.canvasCtx.save();
                this.canvasCtx.translate(x, y);
                this.canvasCtx.rotate(degreeRotation * Math.PI / 180);

                // Draw image to canvas
                this.canvasCtx.drawImage(
                    spriteImage,
                    0,
                    0,
                    attack.spriteWidth,
                    attack.spriteHeight,
                    posX,
                    posY,
                    attack.width,
                    attack.height
                );

                this.canvasCtx.restore();

                // need to update location of projectile
                GameState.updateActiveAttack(attack);
            }
            else if (attack.type === "melee"){
                // render a semi-transparent yellow arc to visualise the swing
                this.canvasCtx.save();
                this.canvasCtx.globalAlpha = 0.45;
                this.canvasCtx.fillStyle = "rgb(255, 220, 60)";
                this.canvasCtx.fillRect(x, y, attack.width, attack.height);
                this.canvasCtx.globalAlpha = 1.0;
                this.canvasCtx.restore();

                GameState.updateActiveAttack(attack);
            }
        }
    }
};

/**
 * Render all spawned enemies to the screen
 */
SceneManager.renderEnemies = function(){
    if (GameState.currentState.spawnedEnemies.length > 0){
        // render each enemy to the canvas
        for (var i in GameState.currentState.spawnedEnemies){
            var enemy = GameState.currentState.spawnedEnemies[i];
            var spritesheetPath = enemy.spritesheet;

            var enemySprite = new Image();
            enemySprite.src = spritesheetPath;

            this.canvasCtx.drawImage(
                enemySprite,
                // x position spritesheet
                (enemy.spriteIndex % 3) * enemy.spriteWidth,
                // y position spritesheet
                (enemy.spriteIndex / 3) * enemy.spriteHeight,
                enemy.spriteWidth,
                enemy.spriteHeight,
                enemy.location.x,
                enemy.location.y,
                enemy.width,
                enemy.height
            );

            GameState.updateActiveEnemy(enemy);
        }
    }
};
