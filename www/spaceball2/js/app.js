// Defining antialias mode for cocoon JS
app.setAntialias = function(platform) {
    switch (platform) {
        case "cocoon":
            if (!app.antialias && typeof (ext) != "undefined") {
                ext.IDTK_APP.makeCall("setDefaultAntialias", 0);
            }
            break;
        case "webkit":
            if (!app.antialias && typeof (ext) == "undefined") {    
                document.querySelector('canvas').getContext('2d').webkitImageSmoothingEnabled = false
            }
            break;
    }
};

// Application general constructor
app.init = function() {
    // Check if height of app is very small
    if (this.width / this.height > 2) {
        // correct height
        this.height = 400;
    };
    
    // Setting antialias mode for cocoon JS
    this.setAntialias('cocoon');
    
    // Box2D Physics initialization
    this.Physics.init(this.scale);

    // Debuggin mode setup
    this.Physics.debug(this.debug);

    // CAAT director object defining
    this.director   = new CAAT.Director().initialize(this.width, this.height);
    
    // Setting antialias mode for webkit
    this.setAntialias('webkit');

    // Adding CAAT scene for production rendering
    this.scene       = this.director.createScene();
    
    // Adding of a background CAAT actor
    this.background  = new CAAT.Actor().setLocation(0, 0);
    
    // Add event bubbling for rocket (so you could drag rocket or a scene)
    this.background.enableEvents(false);
    this.scene.addChild(this.background);
    
    // Load recources
    this.loadResources();
    
    // CAAT animation starting
    this.director.loop(1);
};

// Level generator
app.createLevel = function(level) {
    var self    = this,
        level   = 'level_' + level;
        bricks  = Object.keys(app[level].data);

    // Level background setting
    this.background.setBackgroundImage(app.director.getImage(level), true);
    
    // Bricks field generating
    bricks.forEach(function(brickId) {
        var brick   = Object.create(app[level].data[brickId]);
        brick.id    = brickId;
        
        // Color setting
        brick.color    = app.objectTypes[brick.objType].color;        
        
        // Correcting brick position
        brick.x        = brick.x - 0.15;
        brick.y        = brick.y - 0.3;
        
        self.bricks[brickId]    = Object.create(self.brick).init(brick);
    });
    
    // Creating of a game interface
    app.gameInterface.init();
    
    // Rocket creating
    this.rocket          = Object
                                .create(this.rocketPrototype)
                                .init({ x: app.width / 2 / 30,
                                        y: (app.height - 60) / 30,
                                        id: "rocket"
                                    });
                                    
    // First Balls creating
    this.ball.add('first');
                                    
    // Starting music
    app.director.audioLoop('music_1');
}

// Application start
app.init();
