// Balls container
app.balls = {};

// Ball prototype
app.ball = {
    // Ball constructor
    init: function(caatScene, x, y, radius, impulseX, impulseY) {
        var caatX   = x * app.scale - radius * app.scale,
            caatY   = y * app.scale - radius * app.scale,
            caatWidth    = radius * app.scale * 2,
            details = {
                shape: "circle",
                x: x,
                y: y,
                radius: radius,
                type: app.b2Body.b2_dynamicBody
            };

        // Box2D body exemplar creating
        this.body = Object.create(app.Body).init(app.Physics, details);
        this.body.ApplyImpulse({x:impulseX, y:impulseY}, this.body.GetWorldCenter());

        // CAAT actor for ball creating
        this.actor  = new CAAT.ShapeActor().
        setLocation(caatX, caatY).
        setSize(caatWidth, caatWidth).
        setFillStyle('red').
        setStrokeStyle('#333333');

        // Adding of a CAAT actor to scene
        caatScene.addChild(this.actor);

        return this;
    },

    // Updating of ball CAAT actor location according to Box2D body location
    update: function() {
        var x = (this.body.m_xf.position.x - this.body.m_userData.details.radius) * app.scale,
            y = (this.body.m_xf.position.y - this.body.m_userData.details.radius) * app.scale;

        this.actor.setLocation(x, y);
    }
};
