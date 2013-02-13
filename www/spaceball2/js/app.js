// Application general constructor
app.init = function() {
    // Box2D Physics initialization
    Physics.init(this.scale);

    // Debuggin mode setup
    Physics.debug(this.debug);

    // CAAT director object defining
    this.director   = new CAAT.Director().initialize(this.canvas.w, this.canvas.h);

    // Adding CAAT scene for production rendering
    this.scene       = this.director.createScene();

    // First Balls creating
    this.balls.second    = Object.create(this.ball).init(this.scene, 8, 11, 2, 8, -4);
    this.balls.first     = Object.create(this.ball).init(this.scene, 10, 14, 1, -8, 4);
    this.balls.third     = Object.create(this.ball).init(this.scene, 11, 14, 3, -8, 4);

    // Adding of handler for each frame of animation and simulation
    this.director.onRenderStart = this.frameHandler;

    // CAAT animation starting
    this.director.loop(1);
};

// Application start
app.init();
