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

    // First Balls creating
    this.balls.first     = Object.create(this.ball).init({x:18, y:14, radius:0.5, impulseX:-8, impulseY:10});

    // Rocket creating
    this.rocket          = Object.create(this.rocketPrototype).init({x:16, y:22});

    // Bricks creating
    this.createLevel(1);

    // Adding of handler for each frame of animation and simulation
    this.director.onRenderStart = this.frameHandler;

    // CAAT animation starting
    this.director.loop(1);
};

// Level generator
app.createLevel = function(level) {
    var self    = this,
        level   = 'level_' + level;
        bricks  = Object.keys(app[level]);

    bricks.forEach(function(brickId) {
        var brick   = app[level][brickId];
        this.bricks[brickId]    = Object.create(self.brick).init(brick);
    });
}

// Application start
app.init();
