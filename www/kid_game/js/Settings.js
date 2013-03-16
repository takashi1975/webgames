// General application object
var app = {
    // World scale coefficient for rendering in CAAT with Box2D units
    scale: 30,
    
    // Width of app    
    width: window.innerWidth,
    
    // Height of app
    height: window.innerHeight,
    
    // Size coefficient
    //k: window.innerWidth / 1000,

    // Debug mode rendering
    debug: false,
    
    // Antialiasing mode
    antialias: false,
    
    // Container for actions queue that need to be processed every step
    stepActionsQueue: [],    
    
    // Container for splash screen
    splashScreen: {},
    
    // Container for settings screen
    settingsScreen: {},
    
    // Container for game screen
    gameScreen: {},
    
    // Helping convertor functions from degrees to radians
    rad: function(degrees) {
        return degrees * (Math.PI / 180);
    },
    
    // Helping convertor functions from degrees to radians
    deg: function(radians) {
        return radians * (180 / Math.PI);
    }
}