// General application object
var app = {
    // World scale coefficient for rendering in CAAT with Box2D units
    scale: 30,

    // Dimensions of canvas element
    canvas: {w: window.innerWidth, h: window.innerHeight},

    // Debug mode rendering
    debug: false,
    
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