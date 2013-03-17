// Bricks container
app.bricks = {};

// Brick prototype
app.brick = {
    // Brick constructor
    init: function(data) {
        var width   = 2.1,
            height  = 1.05,
            caatX   = parseInt((width * data.x + 0.5 - width / 2) * app.scale),
            caatY   = parseInt((height * data.y + 1 - height / 2) * app.scale),
            details = {
                shape: "block",
                x: data.x * width + 0.5,
                y: data.y * height + 1,
                width: width,
                height: height,
                bodyType: "static",
                type: "brick",
                id: data.id
            };
        // Set id of this object
        this.id     = data.id;

        // Box2D body exemplar creating
        this.body = Object.create(app.Body).init(app.Physics, details);

        // CAAT actor for brick creating
        this.actor  = new CAAT.Actor().
        setLocation(caatX, caatY).
        enableEvents(false);
    
        // Setting of a cached image to the brick
        this.image    = app.director.getImage('redBrick');
        this.actor.setBackgroundImage(this.image, true);

        // Adding of a CAAT actor to scene
        app.scene.addChild(this.actor);

        return this;
    },
    
    // Destructor
    destroy: function() {
        // Destroying of a Box2d body
        app.Physics.world.DestroyBody(this.body);
        
        // Destroying of an Actor
        app.scene.removeChild(this.actor);
         
        // Destroying of this object
        delete app.bricks[this.id];
        delete this;        
    }
};
