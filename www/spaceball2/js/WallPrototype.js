// Container of a walls
app.walls = {};

// Wall prototype
app.wall = {
    // Wall constructor
    init: function(data) {
        var width   = data.width,
            height  = data.height,
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
                bodyType: "static",
                type: "wall",
                id: data.id
            };

        // Box2D body exemplar creating
        this.body = Object.create(app.Body).init(app.Physics, details);
        
        // CAAT actor for brick creating
        this.actor  = new CAAT.ShapeActor().
        setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).
        setLocation(caatX, caatY).
        setSize(caatWidth, caatHeight).
        setFillStyle('blue').
        setStrokeStyle('#333333').
        enableEvents(false);
    
        // Adding of a CAAT actor to scene
        app.scene.addChild(this.actor);

        return this;
    }
};    
