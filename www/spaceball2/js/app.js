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
        brick.id    = brickId;
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
    this.balls.first     = Object
                                .create(this.ball)
                                .init({ x: this.rocket.body.m_xf.position.x,
                                        y: this.rocket.body.m_xf.position.y - 0.9,
                                        radius: 0.35,
                                        angle: 45,
                                        speed: 8,
                                        id: "first"
                                    }).timeOutBeforePush();
                                    
    // Starting music
    app.director.audioLoop('music');
}

// Loading recources
app.loadRecources = function() {
    // Load audio 
    app.director.
            addAudio('music', 'snd/0.mp3').
            addAudio('1', 'snd/1.mp3').
            addAudio('2', 'snd/2.mp3').
            addAudio('3', 'snd/3.mp3');
    
    new CAAT.ImagePreloader().loadImages(
        [
            {id:'rocket',       url:'img/paddleRed.png'},
            {id:'redBrick',     url:'img/redBrick.png'},
            {id:'level_1',      url:'img/levels/bg1.jpg'},
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
