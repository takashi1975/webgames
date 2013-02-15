// Application general constructor
app.init = function() {
    // Box2D Physics initialization
    this.Physics.init(this.scale);

    // Debuggin mode setup
    this.Physics.debug(this.debug);

    // CAAT director object defining
    this.director   = new CAAT.Director().initialize(this.canvas.w, this.canvas.h);

    // Adding CAAT scene for production rendering
    this.scene       = this.director.createScene();
    
    // Adding of a background CAAT actor
    this.background  = new CAAT.Actor().
    setLocation(0, 0).
    // Add event bubbling for rocket (so you could drag rocket or a scene)
    enableEvents(false);
    this.scene.addChild(this.background);
    
    // Load recources
    this.loadRecources();
    
    // CAAT animation starting
    this.director.loop(1);
};

// Level generator
app.createLevel = function(level) {
    var self    = this,
        level   = 'level_' + level;
        bricks  = Object.keys(app[level]);

    // Level background setting
    this.background.setBackgroundImage(app.director.getImage(level), true);
    
    // Bricks field generating
    bricks.forEach(function(brickId) {
        var brick   = app[level][brickId];
        this.bricks[brickId]    = Object.create(self.brick).init(brick);
    });
    
    // Creating of a game interface
    app.gameInterface.init();
    
    // First Balls creating
    this.balls.first     = Object.create(this.ball).init({x:18, y:14, radius:0.35, impulseX:-5, impulseY:5});

    // Rocket creating
    this.rocket          = Object.create(this.rocketPrototype).init({x:16, y:(app.canvas.h - 120)/30});
}

// Loading recources
app.loadRecources = function() {
    new CAAT.ImagePreloader().loadImages(
        [
            {id:'rocket',       url:'img/paddleRed.png'},
            {id:'redBrick',     url:'img/redBrick.png'},
            {id:'level_1',      url:'img/levels/forest_1.jpg'},
            {id:'ballGrey',     url:'img/ballGrey.png'}
        ],
        function(counter, images) {
            console.log('Loading of ' + counter);
            if (counter == images.length) {
                // Caching of loaded images in director object
                app.director.setImagesCache(images);
                
                // Level creating
                app.createLevel(1);
                
                // Adding of handler for each frame of animation and simulation
                app.director.onRenderStart = app.frameHandler;
            }
            //rocket.image    = new CAAT.SpriteImage().initialize(director.getImage('rocket'), 1, 1);
            //rocket.actor.setBackgroundImage(rocket.image.getRef(), true).setSpriteIndex(0);
        }
    );    
}

// Application start
app.init();
