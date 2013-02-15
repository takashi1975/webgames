// Interface of a game
app.gameInterface = {
    // Constructor of interface
    init: function() {
        // Creating of a walls
        this.createWalls();
    },
    
    // Walls creating
    createWalls: function() {        
        app.walls.top       = Object.create(app.wall).init({x:0.544, y:0.5, width:22.5, height:1});
        app.walls.bottom    = Object.create(app.wall).init({x:0.544, y:25, width:22.5, height:1});
        app.walls.left      = Object.create(app.wall).init({x:0.5, y:0.5, width:1, height:25.5});
        app.walls.right     = Object.create(app.wall).init({x:24, y:0.5, width:1, height:25.5});
    }
}