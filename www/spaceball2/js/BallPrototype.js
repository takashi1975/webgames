// Balls container
app.balls = {};

// Ball prototype
app.ball = {
    // Ball constructor
    init: function(data) {
        var caatX   = data.x * app.scale - data.radius * app.scale,
            caatY   = data.y * app.scale - data.radius * app.scale,
            caatWidth    = data.radius * app.scale * 2,
            details = {
                shape: "circle",
                x: data.x,
                y: data.y,
                radius: data.radius,
                type: 'dynamic'
            };

        // Box2D body exemplar creating
        this.body = Object.create(app.Body).init(app.Physics, details);
        this.push(data.impulseX, data.impulseY);

        // CAAT actor for ball creating
        this.actor  = new CAAT.ShapeActor().
        setLocation(caatX, caatY).
        setSize(caatWidth, caatWidth).
        setFillStyle('white').
        setStrokeStyle('#333333').
        enableEvents(false);

        // Adding of a CAAT actor to scene
        app.scene.addChild(this.actor);

        return this;
    },

    // Updating of ball CAAT actor location according to Box2D body location
    update: function() {
        var x = (this.body.m_xf.position.x - this.body.m_userData.details.radius) * app.scale,
            y = (this.body.m_xf.position.y - this.body.m_userData.details.radius) * app.scale;

        this.actor.setLocation(x, y);
    },

    // Stops ball flying
    stop: function() {
        this.body.SetLinearVelocity(new app.b2Vec2(0,0));
    },

    // Adding an impulse to a ball with specific vector
    push: function(impulseX, impulseY) {
        this.body.ApplyImpulse({x:impulseX, y:impulseY}, this.body.GetWorldCenter());
    }
};
