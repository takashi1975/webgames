// Interface of a game
app.gameInterface = {
    // Constructor of interface
    init: function() {
        // Creating of a walls
        this.createWalls();
    },
    
    // Walls creating
    createWalls: function() {        
        app.walls.top       = Object
                                    .create(app.wall)
                                    .init({ x: 0.5,
                                            y: 0.5,
                                            width: app.width / 30,
                                            height: 1,
                                            id: "top"
                                        });
        
        app.walls.bottom    = Object
                                    .create(app.wall)
                                    .init({ x: 0.5,
                                            y: app.height / 30 - 0.5,
                                            width: app.width / 30,
                                            height: 1,
                                            id: "bottom"
                                        });
        
        app.walls.left      = Object
                                    .create(app.wall)
                                    .init({ x: 0.5,
                                            y: 0.5,
                                            width: 1,
                                            height: app.height / 30,
                                            id: "left"
                                        });
        
        app.walls.right     = Object
                                    .create(app.wall)
                                    .init({ x: app.width / 30 - 0.5,
                                            y: 0.5,
                                            width: 1,
                                            height: app.height / 30,
                                            id: "right"
                                        });
    }
}