// General application object
var app = {
    // World scale coefficient for rendering in CAAT with Box2D units
    scale: 30,
    
    // Width of app    
    //width: window.innerWidth / 2,
    width: 640,
    
    // Height of app
    //height: window.innerHeight / 2,
    height: 640 / (window.innerWidth / window.innerHeight),
    
    // Size coefficient
    //k: window.innerWidth / 1000,

    // Debug mode rendering
    debug: false,
    
    // Antialiasing mode
    antialias: false,
    
    // Container for actions queue that need to be processed every step
    stepActionsQueue: [],
    
    // Helping convertor functions from degrees to radians
    rad: function(degrees) {
        return degrees * (Math.PI / 180);
    },
    
    // Helping convertor functions from degrees to radians
    deg: function(radians) {
        return radians * (180 / Math.PI);
    }
}