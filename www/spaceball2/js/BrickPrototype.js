// Bricks container
app.bricks = {};

// Brick prototype
app.brick = {
    // Brick constructor
    init: function(caatScene, x, y) {
        var width   = 5,
            height  = 3,
            caatX   = (x - width / 2) * app.scale,
            caatY   = (y - height / 2) * app.scale,
            caatWidth    = width * app.scale,
            caatHeight   = height * app.scale,
            details = {
                shape: "block",
                x: x,
                y: y,
                width: width,
                height: height,
                type: app.b2Body.b2_staticBody
            };

        // Box2D body exemplar creating
        this.body = Object.create(app.Body).init(app.Physics, details);

        // CAAT actor for brick creating
        this.actor  = new CAAT.ShapeActor().
        setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).
        setLocation(caatX, caatY).
        setSize(caatWidth, caatHeight).
        setFillStyle('green').
        setStrokeStyle('#333333');

        // Adding of a CAAT actor to scene
        caatScene.addChild(this.actor);

        return this;
    }
};
