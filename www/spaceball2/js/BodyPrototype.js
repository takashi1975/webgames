// Box2D body prototype
app.Body = {
    defaults: {
        shape: "block",
        width: 5,
        height: 5,
        radius: 0.3
    },

    fixtureDefaults: {
        density: 2,
        friction: 0,
        restitution: 1
    },

    definitionDefaults: {
        active: true,
        allowSleep: true,
        angle: 0,
        angularVelocity: 0,
        awake: true,
        bullet: false,
        fixedRotation: false
    },

    init: function (physics, details) {
        this.details = details = details || {};

        // Create the definition
        this.definition = new app.b2BodyDef();

        // Set up the definition
        for (var k in this.definitionDefaults) {
            this.definition[k] = details[k] || this.definitionDefaults[k];
        }

        this.definition.position = new app.b2Vec2(details.x || 0, details.y || 0);
        this.definition.linearVelocity = new app.b2Vec2(details.vx || 0, details.vy || 0);
        this.definition.userData = this;
        this.definition.type = details.type;

        // Create the Body
        this.body = physics.world.CreateBody(this.definition);

        // Create the fixture
        this.fixtureDef = new app.b2FixtureDef();
        for (var l in this.fixtureDefaults) {
            this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
        }

        // Create the shape of a body
        details.shape = details.shape || this.defaults.shape;

        switch (details.shape) {
            case "circle":
                details.radius = details.radius || this.defaults.radius;
                this.fixtureDef.shape = new app.b2CircleShape(details.radius);
                break;
            case "polygon":
                this.fixtureDef.shape = new app.b2PolygonShape();
                this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
                break;
            case "block":
            default:
                details.width = details.width || this.defaults.width;
                details.height = details.height || this.defaults.height;

                this.fixtureDef.shape = new app.b2PolygonShape();
                this.fixtureDef.shape.SetAsBox(details.width / 2,
                    details.height / 2);
                this.fixtureDef.filter.categoryBits = 2;
                break;
        }

        // Create a fixture for object
        this.body.CreateFixture(this.fixtureDef);

        //console.log(this.body);

        return this.body;
    }
};
