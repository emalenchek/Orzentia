/**
 * GameState.js
 */

// initialize game state object
var GameState = {};

GameState.exampleEnemy = {
    "name": "Red Slime",
    "type": "monster",
    "health": 5,
    "experienceYield": 10,
    "spritesheet": "./assets/spritesheets/slime_monster_spritesheet.png",
    "spriteIndex": 6,
    "spriteIndexArrayLength": 8,
    // dictates enemy movement patterm
    // idle (stationary), aggressive (moves towards the player), erratic, etc.
    "movementType": "aggressive",
    "detectsPlayer": false,
    "speed": 2,
    "detectionRange": 250,
    // location on the canvas
    "location": {
        x: 120,
        y: 120
    },
    "spriteWidth": 24,
    "spriteHeight": 24,
    "width": 48,
    "height": 48
};

GameState.newStateTemplate = {
    "start": null,
    "end": null,
    "description": "Game is currently in progress. No end-game criteria has been met yet.",
    "player": {
        // This will be where all information regarding the player is stored
        // Name, Health, Level(?), inventory, equipped, spells/abilities, etc.
        "health": 50,
        "width": 40,
        "height": 40,
        "spriteWidth": 32,
        "spriteHeight": 32,
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
        "spritesheetSource": "./assets/spritesheets/DarwinSprites.png",
        // unsure on the name for now, but it sounds pretty swag
        "incarnate": {
            "school": "fire",
            "type": "projectile",
            "damage": 5,
            "speed": 5,
            "width": 80,
            "height": 80,
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
    "activeAttacks": [],
    "spawnedEnemies": [],
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
                if (GameState.currentState){
                    if (!GameState.currentState.isPaused){
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
                    else {
                        // need to decrement pause menu cursor up one if possible
                        if (GUI.pauseMenuDetails.cursorIndex > 0){
                            GUI.pauseMenuDetails.cursorIndex--;
                            GameState.activeKeys = [];
                        }
                    }
                }
                break;
            case "ArrowDown":
                if (GameState.currentState){
                    if (!GameState.currentState.isPaused){
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
                    else {
                        // need to decrement pause menu cursor up one if possible
                        if (GUI.pauseMenuDetails.cursorIndex < GUI.pauseMenuDetails.options.length - 1){
                            GUI.pauseMenuDetails.cursorIndex++;
                            GameState.activeKeys = [];
                        }
                    }
                }
                break;
            case "ArrowRight":
                if (GameState.currentState){
                    if (!GameState.currentState.isPaused){
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
                if (GameState.currentState){
                    if (!GameState.currentState.isPaused){
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
                // interact with npcs/push buttons/etc.
                break;
            case "z":
            case "Z":
                // light attack (horizontal arc) for now
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
        var trueX = x - (SceneManager.TILE_WIDTH * ((SceneManager.canvasEl.width / 2) / 100));
        var trueY = y + (SceneManager.TILE_HEIGHT * ((SceneManager.canvasEl.height / 2) / 100)) + SceneManager.TILE_HEIGHT;
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
        "height": spell.height
    };
    activeAttacks.push(newAttack);
};

/**
 * Updates an active attack within the game's current state
 * @param {Object} attack - an active attack
 */
GameState.updateActiveAttack = function(attack){
    // eventually want to despawn the projectile once it
    // leaves the "camera"'s view
    if (attack.type === "projectile"){
        var direction = attack.orientation;
        var speed = attack.speed;

        switch (direction){
            case "N":
                var newLocation = {
                    "x": attack.currentLocation.x,
                    "y": attack.currentLocation.y + speed + (SceneManager.TILE_HEIGHT)
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
                    "y": attack.currentLocation.y - speed - (SceneManager.TILE_HEIGHT)
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
 * Make updates to the active enemy object
 * @param {*} enemy - enemy to be updated
 */
GameState.updateActiveEnemy = function(enemy){
    // will want to have some pathfinding algorithm for moving enemies
    // ex. movementType === "agressive", need algorithm to find shortest path to the player
    
    // NOTE: may want to move this outside of the updateActiveEnemy function
    // as we only want to do this every few frames
    GameState.updateActiveEnemySprite(enemy);

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
                GameState.calculateEnemyDamage(attack, enemy);
                GameState.despawnActiveAttack(attack);
                console.log("hit!");
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
    // simple calculation for now
    enemy.health -= attack.damage;
    if (enemy.health <= 0){
        GameState.despawnActiveEnemy(enemy);
    }
}

/**
 * Sets gameState isPaused = true
 */
GameState.pauseGame = function(){
    GameState.currentState.isPaused = true;
};

/**
 * Sets GameState isPaused = false
 */
GameState.unpauseGame = function(){
    GameState.currentState.isPaused = false;
};

/**
 * Toggles game state
 * @returns void
 */
GameState.togglePaused = function(){
    if (!GameState.currentState.isPaused){
        GameState.pauseGame();
        return;
    }
    GameState.unpauseGame();
};
