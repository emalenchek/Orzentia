// This is the file with all data/functionality related to GUI elements

// Definitely want to have some custom typography for text elements
// But for now, we will use a custom one

var GUI = {};

// Data associated with the pause menu for rendering
GUI.pauseMenuDetails = {
    title: "Pause Menu",
    width: 400,
    height: 400,
    options: [
        "Inventory",
        "Character",
        "Settings",
        "Save",
        "Return to Main Menu"
    ],
    backgroundColor: "black",
    foregroundColor: "white",
    font: "JGS-7-FONT",
    cursorIndex: 0
};

GUI.gameOverMenuDetails = {
    title: "Game Over",
    width: 400,
    height: 400,
    options: [
        "Restart"
    ],
    backgroundColor: "black",
    foregroundColor: "white",
    font: "JGS-7-FONT",
    cursorIndex: 0
};

GUI.mainMenuDetails = {
    title: "Main Menu",
    width: 400,
    height: 400,
    options: [
        "Start Game",
        "Settings",
    ],
    backgroundColor: "black",
    foregroundColor: "white",
    font: "JGS-7-FONT",
    cursorIndex: 0
};

// Data associated with the JRPG-style dialogue box
GUI.dialogueBoxDetails = {
    // screen-space dimensions (canvas is 500x500)
    width: 460,
    height: 130,
    // distance from left/bottom edge of the canvas
    screenX: 20,
    screenY: 350,
    padding: 14,
    backgroundColor: "black",
    foregroundColor: "white",
    borderColor: "white",
    font: "JGS-7-FONT",
    nameFontSize: 18,
    textFontSize: 14,
    // indicator shown in the bottom-right corner when more pages remain
    advanceIndicator: ">"
};

