// Rocket prototype
app.rocketPrototype = {
    // Rocket constructor
    init: function(data) {
        var width   = 3.5,
            height  = 0.9,
            caatX   = (data.x - width / 2) * app.scale,
            caatY   = (data.y - height / 2) * app.scale,
            details = {
                shape: "block",
                x: data.x,
                y: data.y,
                width: width,
                height: height,
                bodyType: "static",
                type: "rocket",
                id: data.id
            };

        // Box2D body exemplar creating
        this.body = Object.create(app.Body).init(app.Physics, details);
        
        // CAAT actor for rocket creating
        this.actor  = new CAAT.Actor().
        setLocation(caatX, caatY).
        // Add event bubbling for rocket (so you could drag rocket or a scene)
        enableEvents(false);
        
        // Setting of a cached image to the rocket
        this.image    = new CAAT.SpriteImage().initialize(app.director.getImage('rocket'), 1, 1);
        this.actor.setBackgroundImage(this.image.getRef(), true).setSpriteIndex(0);

        // Adding of a CAAT actor to scene
        app.scene.addChild(this.actor);

        // Adding handling of rocket moving
        app.scene.mouseMove = this.move;
        app.scene.mouseClick = this.move;
        app.scene.mouseDrag = this.move;

        return this;
    },

    // Updating of ball CAAT actor location according to Box2D body location
    update: function() {
        var x = parseInt((this.body.m_xf.position.x - this.body.m_userData.details.width / 2) * app.scale),
            y = parseInt((this.body.m_xf.position.y - this.body.m_userData.details.height / 2) * app.scale);

        this.actor.setLocation(x, y);
    },

    // Moving rocket handler
    move: function(e) {
        app.rocket.body.SetPosition(new app.b2Vec2(e.x / app.scale, app.rocket.body.m_xf.position.y));
    }
};
