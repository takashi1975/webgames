// Bricks container
app.bricks = {};

// Brick prototype
app.brick = {
    // Brick constructor
    init: function(data) {
        var width   = 2,
            height  = 1,
            caatX   = (width * data.x - width / 2) * app.scale,
            caatY   = (height * data.y - height / 2) * app.scale,
            caatWidth    = width * app.scale,
            caatHeight   = height * app.scale,
            details = {
                shape: "block",
                x: data.x * width,
                y: data.y * height,
                width: width,
                height: height,
                type: 'static'
            };

        // Box2D body exemplar creating
        this.body = Object.create(app.Body).init(app.Physics, details);

        // CAAT actor for brick creating
        this.actor  = new CAAT.ShapeActor().
        setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).
        setLocation(caatX, caatY).
        setSize(caatWidth, caatHeight).
        setFillStyle(data.color).
        setStrokeStyle('#333333');

        // Adding of a CAAT actor to scene
        app.scene.addChild(this.actor);

        return this;
    }
};
