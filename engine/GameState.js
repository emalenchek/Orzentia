/**
 * GameState.js
 */

// initialize game state object
var GameState = {};

/**
 * Template for a non-player character (NPC).
 * NPCs are stationary, interactable via the F key when in range,
 * and deliver multi-page dialogue in JRPG style.
 */
GameState.exampleNpc = {
    "name": "Villager",
    // world-space position (same coordinate system as enemies)
    "location": { x: 250, y: 250 },
    // placeholder colour kept for backward compatibility
    "spriteColor": "#8899aa",
    // rendered size matches CharacterSprites output (16×24 native × 2.5 scale)
    "width": 40,
    "height": 60,
    // player must be within this many pixels (true canvas coords) to interact
    "interactionRange": 80,
    // array of dialogue strings; each string is one "page" in the dialogue box
    "dialogue": [ "..." ],
    // visual appearance used by CharacterSprites.renderCharacter
    "appearance": {
        "base": "male",
        "hairStyle": "short",
        "hairColor": "#3D2B1F",
        "clothing": "tunic",
        "clothingColor": "#8899aa",
        "pantsColor": "#3A3028",
        "skinColor": "#F4C4A1",
        "shoeColor": "#2A1A10"
    }
};

/**
 * Village NPC definitions loaded at game start.
 * Positions are in absolute canvas/world coordinates.
 * The player starts at offset (0,0) which maps to true canvas position ~(239, 234),
 * so NPCs are spread around that origin.
 */
GameState.villageNpcDefinitions = [
    {
        "name": "Edren",
        "location": { x: 320, y: 180 },
        "spriteColor": "#c87941",
        "width": 40,
        "height": 60,
        "interactionRange": 80,
        "dialogue": [
            "Still at it. The night stoke finished well -- good ashglass across the eastern furnace.",
            "Sort through it carefully. The last batch had contamination mixed in. We can't afford a spoiled load.",
            "The eggs are stable. Go on."
        ],
        "appearance": {
            "base": "male",
            "hairStyle": "short",
            "hairColor": "#5C3A1E",
            "clothing": "armor",
            "clothingColor": "#c87941",
            "pantsColor": "#4A3020",
            "skinColor": "#D4A070",
            "shoeColor": "#2A1A10"
        }
    },
    {
        "name": "Sela",
        "location": { x: 140, y: 200 },
        "spriteColor": "#7a9fc4",
        "width": 40,
        "height": 60,
        "interactionRange": 80,
        "dialogue": [
            "Don't track ash in here. I just finished cataloguing the cycle logs.",
            "The kingdom's monthly supply order arrived. Same quantities as last season. Nothing unusual.",
            "Father's been up since the third bell. He won't say why."
        ],
        "appearance": {
            "base": "female",
            "hairStyle": "long",
            "hairColor": "#1A1A2E",
            "clothing": "robe",
            "clothingColor": "#7a9fc4",
            "pantsColor": "#3A3A5A",
            "skinColor": "#F0C8A0",
            "shoeColor": "#3A2A18"
        }
    },
    {
        "name": "Old Brenn",
        "location": { x: 365, y: 255 },
        "spriteColor": "#9e8b6f",
        "width": 40,
        "height": 60,
        "interactionRange": 80,
        "dialogue": [
            "I was your age when they last stoked this one for a fresh clutch. Forty-three years ago, that was.",
            "People always ask me how I stand the waiting. You get used to it. Or you don't, and you leave.",
            "These old stones remember every fire we've given them. Treat them with respect."
        ],
        "appearance": {
            "base": "male",
            "hairStyle": "bald",
            "hairColor": "#9e8b6f",
            "clothing": "tunic",
            "clothingColor": "#9e8b6f",
            "pantsColor": "#5A4A38",
            "skinColor": "#C8A880",
            "shoeColor": "#2A1A10"
        }
    },
    {
        "name": "Maret",
        "location": { x: 220, y: 315 },
        "spriteColor": "#7dbb8a",
        "width": 40,
        "height": 60,
        "interactionRange": 80,
        "dialogue": [
            "Did you see the messenger from the capital? Rode in this morning. Didn't even water his horse first.",
            "Father Edren looked calm when he read the letter. You know how he gets when he's actually calm.",
            "I'm sure it's nothing. It's always nothing. Right?"
        ],
        "appearance": {
            "base": "female",
            "hairStyle": "long",
            "hairColor": "#2E5C1A",
            "clothing": "tunic",
            "clothingColor": "#7dbb8a",
            "pantsColor": "#3A4A30",
            "skinColor": "#E8C090",
            "shoeColor": "#2A1A10"
        }
    },
    {
        "name": "Kael",
        "location": { x: 100, y: 315 },
        "spriteColor": "#b07ab0",
        "width": 40,
        "height": 60,
        "interactionRange": 80,
        "dialogue": [
            "Long road back. The capital's noisier than I remembered. More soldiers everywhere.",
            "Don't ask me about it yet. I need to speak with Sela first. Officially.",
            "Just -- keep doing what you're doing. I'll explain everything soon."
        ],
        "appearance": {
            "base": "male",
            "hairStyle": "short",
            "hairColor": "#2A1A3E",
            "clothing": "armor",
            "clothingColor": "#b07ab0",
            "pantsColor": "#3A2A48",
            "skinColor": "#F4C4A1",
            "shoeColor": "#2A1A10"
        }
    },
    {
        "name": "Squink",
        "location": { x: 385, y: 315 },
        "spriteColor": "#4da89e",
        "width": 40,
        "height": 60,
        "interactionRange": 80,
        "dialogue": [
            "You're the one they have picking up the ashes. I could think of worse jobs. I have thought of worse jobs.",
            "The heat doesn't bother me. In case you were wondering.",
            "You keep coming back. I'll call that progress."
        ],
        "appearance": {
            "base": "male",
            "hairStyle": "bald",
            "hairColor": "#4da89e",
            "clothing": "robe",
            "clothingColor": "#4da89e",
            "pantsColor": "#2A5A56",
            "skinColor": "#D8B890",
            "shoeColor": "#2A1A10"
        }
    }
];

GameState.exampleEnemy = {
    "name": "Red Slime",
    "type": "monster",
    "health": 5,
    "experienceYield": 10,
    "spritesheet": "./assets/spritesheets/slime_monster_spritesheet.png",
    "spriteIndex": 6,
    "spriteIndexArrayLength": 8,
    // dictates enemy movement pattern
    // idle (stationary), aggressive (moves towards the player), erratic, etc.
    "movementType": "aggressive",
    "detectsPlayer": false,
    "speed": 2,
    "detectionRange": 250,
    // location on the canvas
    "location": {
        x: 250,
        y: 250
    },
    "spriteWidth": 24,
    "spriteHeight": 24,
    "width": 40,
    "height": 40,
    "strength": 1,
    // frames between consecutive attacks (30 = once per second at 30 FPS)
    "attackCooldownFrames": 30,
    "remainingAttackCooldown": 0,
};

GameState.destroyGameState = function(){
    GameState.currentState = null;
};

GameState.newStateTemplate = {
    "start": null,
    "end": null,
    "description": "Game is currently in progress. No end-game criteria has been met yet.",
    "player": {
        // This will be where all information regarding the player is stored
        // Name, Health, Level(?), inventory, equipped, spells/abilities, etc.
        "health": 5,
        // rendered size matches CharacterSprites output (16×24 native × 2.5 scale = 40×60)
        "width": 40,
        "height": 60,
        "spriteWidth": 16,
        "spriteHeight": 24,
        "level": 1,
        "experience": 0,
        "inventory": [],
        "invulnerabilityFrames": 40,
        "remainingInvulnerabilityFrames": 0,
        "equipment": {
            "weapon": {},
            "head": {},
            "chest": {},
            "legs": {},
            "feet": {}
        },
        // combat stats
        "maxHealth": 5,
        "strength": 1,
        // frames until the player can attack again (20 ≈ 0.67 sec at 30 FPS)
        "attackCooldownFrames": 20,
        "remainingAttackCooldown": 0,
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
        "rotation": 0,
        "spritesheetSource": "./assets/spritesheets/chaseStormSprites.png",
        // visual appearance used by CharacterSprites.renderCharacter
        "appearance": {
            "base": "male",
            "hairStyle": "short",
            "hairColor": "#3D2B1F",
            "clothing": "tunic",
            "clothingColor": "#5B7A4E",
            "pantsColor": "#3A3028",
            "skinColor": "#F4C4A1",
            "shoeColor": "#2A1A10"
        },
        // unsure on the name for now, but it sounds pretty swag
        "incarnate": {
            "school": "fire",
            "type": "projectile",
            "damage": 5,
            "speed": 5,
            "width": 40,
            "height": 40,
            "spriteWidth": 16,
            "spriteHeight": 16,
            // this will eventually be a full spritesheet
            "sprites": [
                "./assets/spells/fireball/Fireball1.png",
                "./assets/spells/fireball/Fireball2.png"
            ]  
        }
        //, ... much more probably
    },
    // changes can and will happen to player data in an active game state
    "isActive": false,
    "activeMenu": null,
    "activeAttacks": [],
    "spawnedEnemies": [],
    // NPCs present in the current area
    "spawnedNpcs": [],
    // set to { npc: Object, pageIndex: Number } while a dialogue is open
    "activeDialogue": null,
    "isPaused": false
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

    // spawn village NPCs
    for (var i = 0; i < GameState.villageNpcDefinitions.length; i++){
        GameState.currentState.spawnedNpcs.push(
            JSON.parse(JSON.stringify(GameState.villageNpcDefinitions[i]))
        );
    }

    SceneManager.updateActiveScene();
};

/**
 * Ends the current game state
 */
GameState.endGame = function(){
    GameState.currentState.end = Date.now();
    GameState.currentState.isActive = false;
    GameState.currentState.isGameOver = true;
    SceneManager.displayGameOverScreen();
};

GameState.checkPlayerStatus = function(){
    if (GameState.currentState.player.health <= 0){
        // player died
        console.log("player died");
        // need to display game over screen
        GameState.endGame();
    }
};

/**
 * Handler updating status of the player entity
 * (health, experience, iframes etc.)
 */
GameState.updatePlayerState = function(){
    var player = GameState.currentState.player;

    if (player.remainingInvulnerabilityFrames > 0){
        player.remainingInvulnerabilityFrames--;
    }

    if (player.remainingAttackCooldown > 0){
        player.remainingAttackCooldown--;
    }

    GameState.checkPlayerStatus();
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
                if (GameState.currentState && !GameState.currentState.activeDialogue){
                    if (GameState.currentState.isActive){
                        // need to peek at new location to see if available
                        var newLocation = {
                            "x": GameState.currentState.player.location.x,
                            "y": GameState.currentState.player.location.y +
                                GameState.currentState.player.speed
                        };
                        if (GameState.isLocationAvailable(newLocation, null, GameState.currentState.player)){
                            // move character up
                            GameState.currentState.player.location.y +=
                            GameState.currentState.player.speed;
                        }
                    }
                }
                break;
            case "ArrowDown":
                if (GameState.currentState && !GameState.currentState.activeDialogue){
                    if (GameState.currentState.isActive){
                        // need to peek at new location to see if available
                        var newLocation = {
                            "x": GameState.currentState.player.location.x,
                            "y": GameState.currentState.player.location.y -
                                GameState.currentState.player.speed
                        };
                        if (GameState.isLocationAvailable(newLocation, null, GameState.currentState.player)){
                            // move character down
                            GameState.currentState.player.location.y -=
                                GameState.currentState.player.speed;
                        }
                    }
                }
                break;
            case "ArrowRight":
                if (GameState.currentState && !GameState.currentState.activeDialogue){
                    if (GameState.currentState.isActive){
                        // need to peek at new location to see if available
                        var newLocation = {
                            "x": GameState.currentState.player.location.x +
                                GameState.currentState.player.speed,
                            "y": GameState.currentState.player.location.y
                        };
                        if (GameState.isLocationAvailable(newLocation, null, GameState.currentState.player)){
                            // move character right
                            GameState.currentState.player.location.x +=
                                GameState.currentState.player.speed;
                        }
                    }
                }
                break;
            case "ArrowLeft":
                // need to peek at new location to see if available
                if (GameState.currentState && !GameState.currentState.activeDialogue){
                    if (GameState.currentState.isActive){
                        var newLocation = {
                            "x": GameState.currentState.player.location.x -
                                GameState.currentState.player.speed,
                            "y": GameState.currentState.player.location.y
                        };
                        if (GameState.isLocationAvailable(newLocation, null, GameState.currentState.player)){
                            // move character left
                            GameState.currentState.player.location.x -=
                                GameState.currentState.player.speed;
                        }
                    }
                }
                break;
            case "f":
            case "F":
                // remove key so action fires once per key-press
                GameState.activeKeys.splice(GameState.activeKeys.indexOf(key), 1);
                if (GameState.currentState.activeDialogue){
                    GameState.advanceDialogue();
                } else {
                    GameState.interactWithNearbyNpc();
                }
                break;
            case "z":
            case "Z":
                // remove key so attack fires once per key-press, not every frame
                GameState.activeKeys.splice(GameState.activeKeys.indexOf(key), 1);
                if (GameState.currentState.activeDialogue){
                    // Z also advances dialogue (common JRPG convention)
                    GameState.advanceDialogue();
                } else {
                    GameState.playerActions.lightAttack();
                }
                break;
            case "X":
            case "x":
                // Heavy (spin attack) w/ slow start time (several frames) and recovery time
                // if holding a direction, player will spin in direction 
                // (scalar? * playerSpeed + current location)
                break;
            case "c":
            case "C":
                // may need to inhibit player movement for a few frames after firing
                // to do so, will try resetting activeKeys
                GameState.activeKeys = [];

                // Magic attack (will start with a fired projectile in direction character is facing).
                GameState.playerActions.castMagic();

                // reset active key list
                GameState.activeKeys = [];
                break;
            case "return":
            case "Return":
            case "enter":
            case "Enter":
                GameState.activeKeys = [];
                GameState.togglePaused();
                GameState.activeKeys = [];
                    break;
            default:
                break;
        }
        return;
    })
};

/**
 * Checks the collision tilemap list to see if the intended location is available
 * @param {Object} newLocation - x/y coord location
 * @param {Boolean} isTrue - whether or not the location is already a "true" location.
 * @param {Object} entity - The entity check
 * Example, enemies locations are tracked without accounting for player offset
 */
GameState.isLocationAvailable = function(newLocation, isTrue, entity){
    var x = newLocation.x;
    var y = newLocation.y;

    // x offset of player (need to subtract half the width as an offset to truly center)
    var xCalc = (SceneManager.canvasEl.width / 2) - (SceneManager.PLAYER_WIDTH / 2);
    // y offset of player (need to subtract half the height as an offset to truly center)
    var yCalc = (SceneManager.canvasEl.height / 2) - (SceneManager.PLAYER_HEIGHT / 2);

    if (!isTrue){
        // use player location as offset (and the offset based on canvas size) to get trueX and trueY
        var trueX = (xCalc + x) + (SceneManager.MAP_WIDTH / SceneManager.TILE_WIDTH);
        var trueY = (yCalc - y) + (SceneManager.MAP_HEIGHT / SceneManager.TILE_HEIGHT) + SceneManager.TILE_HEIGHT;
    }
    else {
        var trueX = x;
        var trueY = y + SceneManager.TILE_HEIGHT;
    }

    // ignore the remainder, as this should check the whole area associated with new location
    var tileXIndex1 = Math.floor((trueX - SceneManager.canvasStartXOffset) / SceneManager.TILE_WIDTH);
    var tileYIndex1 = Math.floor((trueY - SceneManager.canvasStartYOffset) / SceneManager.TILE_HEIGHT);
    var tileXIndex2 = Math.floor((trueX + entity.width - SceneManager.canvasStartXOffset) / SceneManager.TILE_WIDTH);
    var tileYIndex2 = Math.floor((trueY - SceneManager.canvasStartYOffset) / SceneManager.TILE_HEIGHT);
    var tileXIndex3 = Math.floor((trueX - SceneManager.canvasStartXOffset) / SceneManager.TILE_WIDTH);
    var tileYIndex3 = Math.floor((trueY - entity.height - SceneManager.canvasStartYOffset) / SceneManager.TILE_HEIGHT);
    var tileXIndex4 = Math.floor((trueX  + entity.width - SceneManager.canvasStartXOffset) / SceneManager.TILE_WIDTH);
    var tileYIndex4 = Math.floor((trueY - entity.height - SceneManager.canvasStartYOffset) / SceneManager.TILE_HEIGHT);

    // x and y are switched for this calculation
    var arrayIndex1 = (tileYIndex1 * SceneManager.MAP_WIDTH) + tileXIndex1;
    var arrayIndex2 = (tileYIndex2 * SceneManager.MAP_WIDTH) + tileXIndex2;
    var arrayIndex3 = (tileYIndex3 * SceneManager.MAP_WIDTH) + tileXIndex3;
    var arrayIndex4 = (tileYIndex4 * SceneManager.MAP_WIDTH) + tileXIndex4;

    if (GameState.collisionsLookup[arrayIndex1] ||
        GameState.collisionsLookup[arrayIndex2] ||
        GameState.collisionsLookup[arrayIndex3] ||
        GameState.collisionsLookup[arrayIndex4]){
        // found a collision
        console.log("collision detected!!!");
        return false;
    }

    return true;
}

/**
 * Opens dialogue with the nearest NPC within interaction range.
 * Called when the player presses F and no dialogue is already active.
 */
GameState.interactWithNearbyNpc = function(){
    var playerOffsetLoc = GameState.currentState.player.location;
    var playerTrueLoc = SceneManager.getTrueLocation(playerOffsetLoc.x, playerOffsetLoc.y);

    var npcs = GameState.currentState.spawnedNpcs;
    var closestNpc = null;
    var closestDist = Infinity;

    for (var i = 0; i < npcs.length; i++){
        var npc = npcs[i];
        var dist = Game.getDistanceBetweenPoints(playerTrueLoc, npc.location);
        if (dist <= npc.interactionRange && dist < closestDist){
            closestNpc = npc;
            closestDist = dist;
        }
    }

    if (closestNpc){
        GameState.currentState.activeDialogue = {
            "npc": closestNpc,
            "pageIndex": 0
        };
    }
};

/**
 * Advances to the next page of the active dialogue.
 * Closes the dialogue box when the last page is reached.
 */
GameState.advanceDialogue = function(){
    if (!GameState.currentState.activeDialogue){ return; }

    var dialogue = GameState.currentState.activeDialogue;
    dialogue.pageIndex++;

    if (dialogue.pageIndex >= dialogue.npc.dialogue.length){
        GameState.currentState.activeDialogue = null;
    }
};

GameState.playerActions = {};

/**
 * Performs the player's equipped incarnate magic on key press
 */
GameState.playerActions.castMagic = function(){
    var spell = GameState.currentState.player.incarnate;
    if (spell.type === "projectile"){
        GameState.playerActions.fireMagicProjectile(spell);
    }
};

/**
 * Performs a fast melee swing in front of the player (light attack).
 * Creates a short-lived hitbox that damages the first enemy it overlaps.
 * Respects the player's attackCooldownFrames.
 */
GameState.playerActions.lightAttack = function(){
    var player = GameState.currentState.player;
    if (player.remainingAttackCooldown > 0){ return; }

    var orientation = player.orientation;
    var loc = player.location;
    // hitbox is wider than tall so it reads as a horizontal arc
    var hitW = 36;
    var hitH = 24;
    var offsetX = 0;
    var offsetY = 0;

    // position the hitbox directly in front of the player
    switch (orientation){
        case "N":
            offsetX = -(hitW / 2);
            offsetY = (player.height / 2) + 4;
            break;
        case "S":
            offsetX = -(hitW / 2);
            offsetY = -((player.height / 2) + hitH + 4);
            break;
        case "E":
            offsetX = (player.width / 2) + 4;
            offsetY = -(hitH / 2);
            break;
        case "W":
            offsetX = -((player.width / 2) + hitW + 4);
            offsetY = -(hitH / 2);
            break;
        default:
            break;
    }

    var activeAttacks = GameState.currentState.activeAttacks;
    activeAttacks.push({
        "index": activeAttacks.length,
        "type": "melee",
        "subtype": "light",
        "damage": 2 * player.strength,
        "orientation": orientation,
        "currentLocation": { "x": loc.x + offsetX, "y": loc.y + offsetY },
        "width": hitW,
        "height": hitH,
        // active for ~10 frames (~333 ms at 30 FPS)
        "activeFrames": 10,
        // track which enemies were already struck this swing (prevents multi-hit)
        "alreadyHit": []
    });

    player.remainingAttackCooldown = player.attackCooldownFrames;
};

/**
 * updates the rotation value for the player's orientation
 * Based on cardinal direction
 */
 GameState.updatePlayerOrientationValue = function(rotation){
    var orientation = GameState.currentState.player.orientation;
    switch (orientation){
        case "N":
            GameState.currentState.player.rotation = 2;
            break;
        case "S":
            GameState.currentState.player.rotation = 1;
            break;
        case "E":
            GameState.currentState.player.rotation = 3;
            break;
        case "W":
            GameState.currentState.player.rotation = 0;
            break;
        default:
            break;
    };
};

/**
 * Renders a projectile in front of the player
 * (in the direction player is facing), and fires the projectile and 
 * @param {Object} spell - the spell to be cast and transformed into a projectile
 */
GameState.playerActions.fireMagicProjectile = function(spell){
    var spellLocation;
    var playerLocation = GameState.currentState.player.location;
    var playerOrientation = GameState.currentState.player.orientation;
    var speed = spell.speed;

    var playerWidthOffset = (GameState.currentState.player.width / 2);
    var playerHeightOffset = (GameState.currentState.player.height / 2);

    // calculate spell origin location, and direction of travel
    switch (playerOrientation){
        case "N":
            // y - speed
            spellLocation = {
                "x": playerLocation.x - playerWidthOffset,
                "y": playerLocation.y + playerHeightOffset - speed
            };
            break;
        case "S":
            // y + speed
            spellLocation = {
                "x": playerLocation.x - playerWidthOffset,
                "y": playerLocation.y + playerHeightOffset + speed
            };
            break;
        case "W":
            // x - speed
            spellLocation = {
                "x": playerLocation.x - playerWidthOffset - speed,
                "y": playerLocation.y + playerHeightOffset
            };
            break;
        case "E":
            // x + speed
            spellLocation = {
                "x": playerLocation.x - playerWidthOffset + speed,
                "y": playerLocation.y + playerHeightOffset
            };
            break;
        default:
            break;
    }

    var activeAttacks = GameState.currentState.activeAttacks;
    var newAttack = {
        "index": activeAttacks.length,
        "type": "projectile",
        "description": "player magic projectile",
        "sprites": spell.sprites,
        "damage": spell.damage,
        "spriteIndex": 0,
        "originLocation": JSON.parse(JSON.stringify(spellLocation)),
        "currentLocation": JSON.parse(JSON.stringify(spellLocation)),
        "orientation": playerOrientation,
        "speed": speed,
        "width": spell.width,
        "height": spell.height,
        "spriteWidth": spell.spriteWidth,
        "spriteHeight": spell.spriteHeight
    };
    activeAttacks.push(newAttack);
};

/**
 * Updates an active attack within the game's current state
 * @param {Object} attack - an active attack
 */
GameState.updateActiveAttack = function(attack){
    if (attack.type === "melee"){
        attack.activeFrames--;
        if (attack.activeFrames <= 0){
            GameState.despawnActiveAttack(attack);
        }
        return;
    }

    // eventually want to despawn the projectile once it
    // leaves the "camera"'s view
    if (attack.type === "projectile"){
        var direction = attack.orientation;
        var speed = attack.speed;

        switch (direction){
            case "N":
                var newLocation = {
                    "x": attack.currentLocation.x,
                    "y": attack.currentLocation.y + speed - (0.5 * SceneManager.TILE_WIDTH),
                };

                // check for terrain collision
                if (GameState.isLocationAvailable(newLocation, null, attack)){
                    attack.currentLocation.y += speed;
                }
                else {
                    // despawn this attack
                    GameState.despawnActiveAttack(attack);
                }
                break;
            case "S":
                var newLocation = {
                    "x": attack.currentLocation.x,
                    "y": attack.currentLocation.y - speed - (2 * SceneManager.TILE_WIDTH)
                };
                // check for terrain collision
                if (GameState.isLocationAvailable(newLocation, null, attack)){
                    attack.currentLocation.y -= speed;
                }
                else {
                    // despawn this attack
                    GameState.despawnActiveAttack(attack);
                }
                break;
            case "W":
                var newLocation = {
                    "x": attack.currentLocation.x - speed - (SceneManager.TILE_WIDTH),
                    "y": attack.currentLocation.y
                };
                // check for terrain collision
                if (GameState.isLocationAvailable(newLocation, null, attack)){
                    attack.currentLocation.x -= speed;
                }
                else {
                    // despawn this attack
                    GameState.despawnActiveAttack(attack);
                }
                break;
            case "E":
                var newLocation = {
                    "x": attack.currentLocation.x + speed + (SceneManager.TILE_WIDTH),
                    "y": attack.currentLocation.y
                };
                // check for terrain collision
                if (GameState.isLocationAvailable(newLocation, null, attack)){
                    attack.currentLocation.x += speed;
                }
                else {
                    // despawn this attack
                    GameState.despawnActiveAttack(attack);
                }
                break;
        }

        // need to reset the sprite index
        if (attack.sprites){
            attack.spriteIndex++;
            if (attack.spriteIndex >= attack.sprites.length){
                attack.spriteIndex = 0;
            }
        }

        var originX = attack.originLocation.x;
        var originY = attack.originLocation.y;
        var currentX = attack.currentLocation.x;
        var currentY = attack.currentLocation.y;

        // if projectile has traveled half of the screen's width/height
        if (
            (Math.abs(currentX - originX) > (SceneManager.CANVAS_WIDTH / 2)) ||
            (Math.abs(currentY - originY) > (SceneManager.CANVAS_HEIGHT / 2)) 
        ){
            GameState.despawnActiveAttack(attack);
        }
    }
};

/**
 * Despawns an active attack, and reindexes the activeAttacks list
 * @param {Object} attack - active attack to be despawned
 */
GameState.despawnActiveAttack = function(attack){
    // need to despawn this action
    // or remove from activeAction list
    GameState.currentState.activeAttacks.splice(attack.index, 1);
    // reindex the activeAttacks list
    GameState.currentState.activeAttacks.map(function(attack, index){
        if (attack.index > index){
            attack.index = index;
        }
        return;
    });
};

/**
 * Spawns a new enemy, and adds it to the current game state
 */
GameState.spawnEnemy = function(enemyObject){
    // Similarly, to despawn, may want to a spawning enemy
    // to toggle hitbox on after a "spawn animation"
    var length = GameState.currentState.spawnedEnemies;
    enemyObject.index = length;
    GameState.currentState.spawnedEnemies.push(enemyObject);
};

/**
 * Despawns an active enemy, and removes it from the list of spawnedEnemies
 * @param {Object} enemy - enemy within spawnedEnemies list to be despawned
 */
GameState.despawnActiveEnemy = function(enemy){
    // TODO:
    // May want to adjust this to flag enemies for despawn,
    // so that we may render a "defeat/despawning" animation to the user
    // But, for now we can just delete the Enemy
    GameState.currentState.spawnedEnemies.splice(enemy.index, 1);
    // reindex the spawnedEnemies list
    GameState.currentState.spawnedEnemies.map(function(enemy, index){
        if (enemy.index > index){
            enemy.index = index;
        }
        return;
    });
};

/**
 * Modifies the active sprite index for specified enemy,
 * NOTE: This will probably only need to be called every few frames
 * @param {Object} enemy - the enemy object to be adjusted 
 */
GameState.updateActiveEnemySprite = function(enemy){
    // enemy.spriteIndex++;
    if (enemy.spriteIndex >= enemy.spriteIndexArrayLength){
        enemy.spriteIndex = 0;
    }
};

/**
 * See if the player is within line of sight of the specified enemy
 * @param {Object} enemy - the enemy that is doing the "detection"
 */
GameState.checkEnemyDetectsPlayer = function(enemy){
    var playerOffsetLocation = GameState.currentState.player.location;
    var enemyLocation = enemy.location;

    var playerLocation = SceneManager.getTrueLocation(playerOffsetLocation.x, playerOffsetLocation.y);

    // should probably break this out 
    var distanceFromPlayerToEnemy = Game.getDistanceBetweenPoints(enemyLocation, playerLocation);

    if (distanceFromPlayerToEnemy <= enemy.detectionRange){
        // need to check every tile between enemy and player
        // to decide whether player is "visible" to enemy
        var found = true;
        // console.log(enemy.name + " detects player!!");
        // TODO
        // actually check each tile between enemy and player
        return found;
    }
    return false;
};

/**
 * Gets list of all available moves that can be performed
 * By specified enemy
 * @param {Object} enemy - the enemy to obtain possible moves for
 */
GameState.getPossibleEnemyMoves = function(enemy){
    var availableMoves = [];
    if (enemy.movementType === "aggressive" ||
        enemy.movementType === "erratic"){
            var enemyLocation = enemy.location;
            // check all possible moves to see if they are available
            var count = 0;
            while (count < 4){
                var newLocation = JSON.parse(JSON.stringify(enemyLocation));
                switch (count){
                    case 0:
                        newLocation.x = newLocation.x + enemy.speed;
                        break;
                    case 1:
                        newLocation.x = newLocation.x - enemy.speed;
                        break;
                    case 2:
                        newLocation.y = newLocation.y + enemy.speed;
                        break;
                    case 3:
                        newLocation.y = newLocation.y - enemy.speed;
                        break;
                    default:
                        break;
                }

                if (GameState.isLocationAvailable(newLocation, true, enemy)){
                    availableMoves.push(newLocation);       
                }

                count++;
            }
            return availableMoves;
    }
    return [];
};


/**
 * Updates the position of specified "aggressive" enemy
 * to move closer to the player
 * @param {Object} enemy - enemy to update position 
 */
GameState.updateEnemyAggressivePosition = function(enemy){
    var playerOffsetLocation = GameState.currentState.player.location;
    var playerLocation = SceneManager.getTrueLocation(playerOffsetLocation.x, playerOffsetLocation.y);
    var enemyLocation = enemy.location;

    // get distance from player to enemy
    var distanceFromPlayerToEnemy = Game.getDistanceBetweenPoints(enemyLocation, playerLocation);
    
    var possibleEnemyMoves = GameState.getPossibleEnemyMoves(enemy);
    var selectedMove = null;
    for (var i in possibleEnemyMoves){
        // find best available move
        // "best" is the one that will move closest to the player
        var newLocation = possibleEnemyMoves[i];

        var newDistanceToPlayer = Game.getDistanceBetweenPoints(newLocation, playerLocation);
        if (newDistanceToPlayer <= distanceFromPlayerToEnemy){
            if (selectedMove === null){
                selectedMove = newLocation;
            }
            else {
                // see if the new move is a better option
                var selectedMoveDistance = Game.getDistanceBetweenPoints(selectedMove, playerLocation);
                if (selectedMoveDistance > newDistanceToPlayer){
                    selectedMove = newLocation;
                }
            }
        }
    }

    if (selectedMove !== null){
        enemy.location = selectedMove;
    }
};

/**
 * Calculates the damage to the player entity
 * @param {*} enemy - the enemy that is attacking the player
 */
GameState.calculatePlayerDamage = function(enemy){
    if (GameState.currentState.player.remainingInvulnerabilityFrames <= 0){
        GameState.currentState.player.health -= enemy.strength;
        GameState.currentState.player.remainingInvulnerabilityFrames = GameState.currentState.player.invulnerabilityFrames;
    }
};

/**
 * Determine whether the enemy entity is colliding with the player entity on this frame
 * @param {*} enemy - enemy to check for collision with player
 */
GameState.isCollidingWithPlayer = function(enemy){
    var playerOffsetLocation = GameState.currentState.player.location;
    var enemyLocation = enemy.location;

    var playerLocation = SceneManager.getTrueLocation(playerOffsetLocation.x, playerOffsetLocation.y);

    // collision check
    var hit = enemyLocation.x + enemy.width >= playerLocation.x &&
        playerLocation.x + GameState.currentState.player.width >= enemyLocation.x &&
        enemyLocation.y + enemy.height >= playerLocation.y &&
        playerLocation.y + GameState.currentState.player.height >= enemyLocation.y;

    if (hit){
        console.log ("player hit by " + enemy.name + "!!");

        // only deal damage once per cooldown window
        if (enemy.remainingAttackCooldown <= 0){
            GameState.calculatePlayerDamage(enemy);
            enemy.remainingAttackCooldown = enemy.attackCooldownFrames;
        }
    }
};

/**
 * Make updates to the active enemy object
 * @param {*} enemy - enemy to be updated
 */
GameState.updateActiveEnemy = function(enemy){
    // will want to have some pathfinding algorithm for moving enemies
    // ex. movementType === "agressive", need algorithm to find shortest path to the player

    // NOTE: may want to move this outside of the updateActiveEnemy function
    // as we only want to do this every few frames
    GameState.updateActiveEnemySprite(enemy);

    // tick down the enemy's attack cooldown each frame
    if (enemy.remainingAttackCooldown > 0){
        enemy.remainingAttackCooldown--;
    }

    var type = enemy.movementType;
    switch (type){
        case "custom":
            // enemy has a predefined movement
            enemy.performCustomAction();
            break;
        case "idle":
            // do nothing, the enemy does not move
            break;
        case "aggressive":
            // If player is within L.O.S, move towards the player. 
            // L.O.S is a straight line without any colliding tiles interfering.
            var detected = GameState.checkEnemyDetectsPlayer(enemy);

            if (detected){
                // update enemy position by speed towards the player
                GameState.updateEnemyAggressivePosition(enemy);

                GameState.isCollidingWithPlayer(enemy);
            }

            break;
        case "erratic":
            // nothing yet
            break;
        default:
            break;
    }
};

/**
 * Determine whether an active attack impacted an enemy on this frame
 * Checks list of activeAttacks and spawnedEnemies
 */
GameState.checkAttackEnemyCollision = function(){
    var activeAttacks = GameState.currentState.activeAttacks;
    var activeEnemies = GameState.currentState.spawnedEnemies;

    // We want to check every attack's location against
    // every active enemy
    for (var i in activeAttacks){
        for (var j in activeEnemies){
            var attack = activeAttacks[i];
            var enemy = activeEnemies[j];

            // need to adjust the attack location, as not based off the canvas
            var attackLocation = SceneManager.getTrueLocation(
                attack.currentLocation.x,
                attack.currentLocation.y
            );

            // collision check
            var hit = attackLocation.x + attack.width >= enemy.location.x &&
                enemy.location.x + enemy.width >= attackLocation.x &&
                attackLocation.y + attack.height >= enemy.location.y &&
                enemy.location.y + enemy.height >= attackLocation.y;
            

            
            if (hit){
                if (attack.type === "melee"){
                    // each enemy can only be struck once per swing
                    var alreadyHit = false;
                    for (var k = 0; k < attack.alreadyHit.length; k++){
                        if (attack.alreadyHit[k] === enemy.index){
                            alreadyHit = true;
                            break;
                        }
                    }
                    if (!alreadyHit){
                        attack.alreadyHit.push(enemy.index);
                        GameState.calculateEnemyDamage(attack, enemy);
                        console.log("melee hit!");
                    }
                } else {
                    GameState.calculateEnemyDamage(attack, enemy);
                    GameState.despawnActiveAttack(attack);
                    console.log("hit!");
                }
            }
        }
    }
};

/**
 * 
 * @param {*} attack - The attack being delivered to the enemy target
 * @param {*} enemy - The recipient of the attack
 */
GameState.calculateEnemyDamage = function(attack, enemy){
    enemy.health -= attack.damage;
    if (enemy.health <= 0){
        // award experience before removing the enemy
        GameState.currentState.player.experience += enemy.experienceYield;
        GameState.checkLevelUp();
        GameState.despawnActiveEnemy(enemy);
    }
};

/**
 * Returns the total experience required to advance from the given level.
 * Formula: 100 * level^1.5 (produces a gentle exponential curve).
 * @param {Number} level - current player level
 */
GameState.getExperienceToNextLevel = function(level){
    return Math.floor(100 * Math.pow(level, 1.5));
};

/**
 * Checks if the player has enough experience to level up, and applies
 * stat gains for each level earned. Handles multi-level gains in one call.
 */
GameState.checkLevelUp = function(){
    var player = GameState.currentState.player;
    var threshold = GameState.getExperienceToNextLevel(player.level);
    while (player.experience >= threshold){
        player.experience -= threshold;
        player.level++;
        player.maxHealth += 2;
        // restore some health on level up, but do not exceed new max
        player.health = Math.min(player.health + 2, player.maxHealth);
        player.strength++;
        threshold = GameState.getExperienceToNextLevel(player.level);
    }
};

/**
 * Set active menu based on menu type passed in, and register input handlers
 * for the corresponding menu
 * @param {*} menu 
 */
GameState.setActiveMenu = function(menu){
    GameState.currentState.activeMenu = menu;
    GameState.registerMenuInputHandlers(menu);
};

/**
 * Registers input handlers for the main menu
 */
GameState.registerPauseMenuInputHandlers = function(){
    // use gameState.activeKeys map to determine the user input
    // and handle the corresponding action
    GameState.activeKeys.map(function(key){
        switch (key){
            case "ArrowUp":
                // consume the key so the cursor moves once per press, not every frame
                GameState.activeKeys.splice(GameState.activeKeys.indexOf(key), 1);
                if (GUI.pauseMenuDetails.cursorIndex > 0){
                    GUI.pauseMenuDetails.cursorIndex--;
                }
                break;
            case "ArrowDown":
                // consume the key so the cursor moves once per press, not every frame
                GameState.activeKeys.splice(GameState.activeKeys.indexOf(key), 1);
                if (GUI.pauseMenuDetails.cursorIndex < GUI.pauseMenuDetails.options.length - 1){
                    GUI.pauseMenuDetails.cursorIndex++;
                }
                break;
            case "Z":
            case "z":
                // consume so confirm fires once per press
                GameState.activeKeys.splice(GameState.activeKeys.indexOf(key), 1);
                switch (GUI.pauseMenuDetails.options[GUI.pauseMenuDetails.cursorIndex]){
                    case "Inventory":
                        break;
                    case "Character":
                        break;
                    case "Settings":
                        break;
                    case "Save":
                        break;
                    case "Return to Main Menu":
                        Game.end();
                        break;
                    default:
                        break;
                }
                break;
            case "Enter":
            case "Return":
            case "X":
            case "x":
                // close the current menu
                GameState.togglePaused();

                // clear active keys
                GameState.activeKeys = [];

                GameState.clearActiveMenu();
                GameState.currentState.isPaused = false;
                GameState.currentState.isActive = true;
                break;
            default:
                break;
        }
    });
};


/**
 * Registers input handlers for the main menu
 */
GameState.registerMainMenuInputHandlers = function(){
    // use gameState.activeKeys map to determine the user input
    // and handle the corresponding action
    GameState.activeKeys.map(function(key){
        switch (key){
            case "ArrowUp":
                if (GUI.mainMenuDetails.cursorIndex > 0){
                    GUI.mainMenuDetails.cursorIndex--;
                }
                break;
            case "ArrowDown":
                if (GUI.mainMenuDetails.cursorIndex < GUI.mainMenuDetails.options.length - 1){
                    GUI.mainMenuDetails.cursorIndex++;
                }
                break;
            case "Z":
            case "z":
                switch (GUI.mainMenuDetails.options[GUI.mainMenuDetails.cursorIndex]){
                    case "Start Game":
                        Game.start();
                        break;
                    case "Settings":
                        break;
                    default:
                        break;
                }
                break;
            case "Enter":
            case "Return":
                // close the current menu
                // GameState.clearActiveMenu();
                break;
            default:
                break;
        }
    });
};

/**
 * Registers input handlers for the game over menu
 */
GameState.registerGameOverMenuInputHandlers = function(){
    // use gameState.activeKeys map to determine the user input
    // and handle the corresponding action
    GameState.activeKeys.map(function(key){
        switch (key){
            case "Z":
            case "z":
                switch (GUI.gameOverMenuDetails.options[GUI.gameOverMenuDetails.cursorIndex]){
                    case "Restart":
                        Game.start();
                        break;
                    default:
                        break;
                }
                break;
            case "Enter":
            case "Return":
                // close the current menu
                // GameState.clearActiveMenu();
                break;
            default:
                break;
        }
    });
};

/**
 * Register menu input handlers for all menus
 * @param {*} menu 
 */
GameState.registerMenuInputHandlers = function(menu){
    // switch based on menu type to determine input handlers
    switch (menu){
        case "pause":
            // need to register input handlers for the pause menu
            GameState.registerPauseMenuInputHandlers();
            break;
        case "main":
            GameState.registerMainMenuInputHandlers();
        case "gameOver":
            GameState.registerGameOverMenuInputHandlers();
        default:
            break;
    }
};

/**
 * Clear the active menu assignment for the current game state
 */
GameState.clearActiveMenu = function(){
    if (GameState.currentState){
        GameState.currentState.activeMenu = null;
    }
};


/**
 * Sets gameState isPaused = true
 */
GameState.pauseGame = function(){
    GameState.currentState.activeMenu = "pause";
    var menu = GameState.currentState.activeMenu;
    GameState.currentState.isActive = false;
    GameState.currentState.isPaused = true;

    // set input handlers to navigate and interact with menu
    // options
    GameState.registerMenuInputHandlers(menu);
};

/**
 * Sets GameState isPaused = false
 */
GameState.unpauseGame = function(){
    GameState.clearActiveMenu();
    GameState.currentState.isPaused = false;
    GameState.currentState.isActive = true;
};

/**
 * Toggles game state
 * @returns void
 */
GameState.togglePaused = function(){
    if (GameState.currentState.isGameOver){
        return;
    }

    if (GameState.currentState.isActive){
        GameState.pauseGame();
        return;
    }
    GameState.unpauseGame();
};
