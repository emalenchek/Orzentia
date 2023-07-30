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
