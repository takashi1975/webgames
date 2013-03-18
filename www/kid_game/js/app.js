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
    // Setting antialias mode for cocoon JS
    this.setAntialias('cocoon');
    
    // CAAT director object defining
    this.director   = new CAAT.Director().initialize(this.width, this.height);
    
    // Setting antialias mode for webkit
    this.setAntialias('webkit');
    
    // Adding CAAT scene for settings page
    this.splashScreen.scene         = this.director.createScene();

    // Adding CAAT scene for settings page
    this.settingsScreen.scene       = this.director.createScene();
    
    // Adding CAAT scene for game page
    this.gameScreen.scene           = this.director.createScene();
    
    // Load recources
    this.loadRecources();
    
    // CAAT animation starting
    this.director.loop(1);
};

// Game starter
app.startGame = function(level) {
    var self = this;
    
    // Adding of a background CAAT actor for splash screen
    this.splashScreen.backgroundActor  = new CAAT.Actor().setLocation(0, 0);
    this.splashScreen.scene.addChild(this.splashScreen.backgroundActor);
    this.splashScreen.backgroundActor.setBackgroundImage(app.director.getImage('splash'), true);
    
    // Adding of a button CAAT actor for back to splashScreen screen
    this.splashScreen.button = app.createButton(this.director, 'play');
    this.splashScreen.button.mouseClick = function(e) {
        self.director.easeInOut(
            1,
            CAAT.Scene.EASE_TRANSLATE,
            CAAT.Actor.ANCHOR_RIGHT,
            0,
            CAAT.Scene.EASE_TRANSLATE,
            CAAT.Actor.ANCHOR_LEFT,
            2000,
            false,
            new CAAT.Interpolator().createExponentialOutInterpolator(6, false),
            new CAAT.Interpolator().createExponentialOutInterpolator(6, false)
        );
    };
    this.splashScreen.scene.addChild(this.splashScreen.button);        
    
    // Adding of a background CAAT actor for settings screen
    this.settingsScreen.backgroundActor  = new CAAT.Actor().setLocation(0, 0);
    this.settingsScreen.scene.addChild(this.settingsScreen.backgroundActor);
    this.settingsScreen.backgroundActor.setBackgroundImage(app.director.getImage('settings'), true);
    
    // Adding of a button CAAT actor for settings screen
    this.settingsScreen.button = app.createButton(this.director, 'Go to game scene');
    this.settingsScreen.button.mouseClick = function(e) {
        self.director.easeInOut(
            2,
            CAAT.Scene.EASE_TRANSLATE,
            CAAT.Actor.ANCHOR_RIGHT,
            1,
            CAAT.Scene.EASE_TRANSLATE,
            CAAT.Actor.ANCHOR_LEFT,
            2000,
            false,
            new CAAT.Interpolator().createBounceOutInterpolator(),
            new CAAT.Interpolator().createBounceOutInterpolator()
        );
    };
    this.settingsScreen.scene.addChild(this.settingsScreen.button);    

    // Adding of a background CAAT actor for game screen
    this.gameScreen.backgroundActor  = new CAAT.Actor().setLocation(0, 0);
    this.gameScreen.scene.addChild(this.gameScreen.backgroundActor);
    this.gameScreen.backgroundActor.setBackgroundImage(app.director.getImage('game'), true);
    
    // Some sheep actor for game test
    this.gameScreen.sheepActor  = new CAAT.Actor().setLocation(100, 250);
    this.gameScreen.scene.addChild(this.gameScreen.sheepActor);
    this.gameScreen.sheepActor.setBackgroundImage(app.director.getImage('sheep'), true);
    this.gameScreen.sheepActor.mouseClick = function(e) {
        //self.gameScreen.scene.removeChild(self.gameScreen.sheepActor);
        self.gameScreen.sheepActor.setBackgroundImage(app.director.getImage('sheep2'), true).setScale(0.5, 0.5);
    };
    
    // Some sheep actor 2 for game test
    this.gameScreen.sheepActor2  = new CAAT.Actor().setLocation(350, 250).setScale(0.7, 0.7);
    this.gameScreen.scene.addChild(this.gameScreen.sheepActor2);
    this.gameScreen.sheepActor2.setBackgroundImage(app.director.getImage('sheep'), true);
    this.gameScreen.sheepActor2.mouseClick = function(e) {
        self.gameScreen.scene.removeChild(self.gameScreen.sheepActor2);
    };
    
    // Adding of a button CAAT actor for back to settings screen
    this.gameScreen.button = app.createButton(this.director, 'Go to settings scene');
    this.gameScreen.button.mouseClick = function(e) {
        self.director.easeInOut(
            1,
            CAAT.Scene.EASE_TRANSLATE,
            CAAT.Actor.ANCHOR_RIGHT,
            2,
            CAAT.Scene.EASE_TRANSLATE,
            CAAT.Actor.ANCHOR_LEFT,
            2000,
            false,
            new CAAT.Interpolator().createBounceOutInterpolator(),
            new CAAT.Interpolator().createBounceOutInterpolator()
        );
    };
    this.gameScreen.scene.addChild(this.gameScreen.button);       

    this.director.setScene(0);
}

// create an actor with a custom paint method. its behavior resembles that of
// a button.
app.createButton = function(director, text) {
    var actor= new CAAT.Actor().
            setSize( 60, 60 ).
            centerAt( director.width - 40, director.height - 40 );

    actor.paint= function( director, time ) {

        var ctx= director.ctx;
        ctx.save();

        ctx.fillStyle= this.pointed ? 'orange' : '#f3f';
        ctx.fillRect(0,0,this.width,this.height );

        ctx.strokeStyle= this.pointed ? 'red' : 'black';
        ctx.strokeRect(0,0,this.width,this.height );

        ctx.strokeStyle='white';
        ctx.beginPath();
        ctx.moveTo(5,10);
        ctx.lineTo(20,10);
        ctx.lineTo(15,5);

        ctx.moveTo(20,10);
        ctx.lineTo(15,15);

        ctx.lineWidth=2;
        ctx.lineJoin='round';
        ctx.lineCap='round';
        ctx.stroke();
        ctx.restore();

        ctx.font= '10px sans-serif';
        ctx.fillStyle='black';
        ctx.fillText(
            text,
            3,
            45);
    };

    return actor;
}

// Loading recources
app.loadRecources = function() {
    new CAAT.ImagePreloader().loadImages(
        [
            {id:'splash',       url:'img/bg/bg1.jpg'},
            {id:'settings',     url:'img/bg/bg2.jpg'},
            {id:'game',         url:'img/bg/bg3.jpg'},
            {id:'sheep',        url:'img/sheep.png'},
            {id:'sheep2',       url:'img/sheep2.png'}
        ],
        function(counter, images) {
            console.log('Loading of ' + counter);
            if (counter == images.length) {
                // Caching of loaded images in director object
                app.director.setImagesCache(images);
                
                // Start game
                app.startGame();
            }
        }
    );    
}

// Application start
app.init();
