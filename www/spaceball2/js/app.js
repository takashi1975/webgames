// References for Box2D general objects for simplicity
var b2Vec2              = Box2D.Common.Math.b2Vec2;
var b2BodyDef           = Box2D.Dynamics.b2BodyDef;
var b2Body              = Box2D.Dynamics.b2Body;
var b2FixtureDef        = Box2D.Dynamics.b2FixtureDef;
var b2Fixture           = Box2D.Dynamics.b2Fixture;
var b2World             = Box2D.Dynamics.b2World;
var b2MassData          = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape      = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape       = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw         = Box2D.Dynamics.b2DebugDraw;
var b2ContactListener   = Box2D.Dynamics.b2ContactListener;

// Box2D general physics object
var Physics = {
    // World creation constructor
    init: function(scale) {
        var gravity         = new b2Vec2(0, 0);
        this.world          = new b2World(gravity, true);
        this.scale          = scale || 30;
        this.dtRemaining    = 0;
        this.stepAmount     = 1 / 60;
        this.collision();

        return this;
    },

    // Emulation step iteration
    step: function (dt) {
        this.dtRemaining += dt;
        while (this.dtRemaining > this.stepAmount) {
            this.dtRemaining -= this.stepAmount;
            this.world.Step(this.stepAmount,
            8, // velocity iterations
            3); // position iterations
        };
        if (this.debugDraw) {
            this.world.DrawDebugData();
        }
    },

    // Collisions handling
    collision: function () {
        this.listener = new b2ContactListener();
        this.listener.PostSolve = function (contact, impulse) {

            var bodyA = contact.GetFixtureA().GetBody().GetUserData(),
                bodyB = contact.GetFixtureB().GetBody().GetUserData();

            if (bodyA.contact) {
                bodyA.contact(contact, impulse, true)
            }

            if (bodyB.contact) {
                bodyB.contact(contact, impulse, false)
            }
        };
        this.world.SetContactListener(this.listener);
    },

    // Debugging rendering
    debug: function(flag) {
        if (flag) {
            // Debugging is enabled
            // Adding canvas for debugging
            var canvas          = document.createElement('canvas');
            canvas.width        = 1024;
            canvas.height       = 768;
            canvas.setAttribute("class", "debug");
            document.body.appendChild(canvas);

            this.element        = canvas;
            this.context        = canvas.getContext("2d");

            this.debugDraw = new b2DebugDraw();
            this.debugDraw.SetSprite(this.context);
            this.debugDraw.SetDrawScale(this.scale);
            this.debugDraw.SetFillAlpha(0.3);
            this.debugDraw.SetLineThickness(1.0);
            this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this.world.SetDebugDraw(this.debugDraw);

            console.log('DEBUG MODE ENABLED');
        } else {
            console.log('CAAT MODE ENABLED');
        }
    }
};

// General application object
var app = {
    // CAAT director object defining
    director: new CAAT.Director().initialize(1024, 768),

    // Box2D body prototype
    Body: {
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
            this.definition = new b2BodyDef();

            // Set up the definition
            for (var k in this.definitionDefaults) {
                this.definition[k] = details[k] || this.definitionDefaults[k];
            };

            this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
            this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
            this.definition.userData = this;
            this.definition.type = details.type;

            // Create the Body
            this.body = physics.world.CreateBody(this.definition);

            // Create the fixture
            this.fixtureDef = new b2FixtureDef();
            for (var l in this.fixtureDefaults) {
                this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
            }

            // Create the shape of a body
            details.shape = details.shape || this.defaults.shape;

            switch (details.shape) {
                case "circle":
                    details.radius = details.radius || this.defaults.radius;
                    this.fixtureDef.shape = new b2CircleShape(details.radius);
                    break;
                case "polygon":
                    this.fixtureDef.shape = new b2PolygonShape();
                    this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
                    break;
                case "block":
                default:
                    details.width = details.width || this.defaults.width;
                    details.height = details.height || this.defaults.height;

                    this.fixtureDef.shape = new b2PolygonShape();
                    this.fixtureDef.shape.SetAsBox(details.width / 2,
                        details.height / 2);
                    this.fixtureDef.filter.categoryBits = 2;
                    break;
            };

            // Create a fixture for object
            this.body.CreateFixture(this.fixtureDef);

            return this.body;
        }
    },

    // Ball prototype
    ball: {
        // Ball constructor
        init: function(x, y, impulseX, impulseY) {
            var newBall = Object.create(app.Body).init(Physics, {shape:"circle", x:x, y:y});
            newBall.ApplyImpulse({x:impulseX, y:impulseY}, newBall.GetWorldCenter());

            return newBall;
        }
    },

    // Balls container
    balls: {},

    // Application general constructor
    init: function() {
        // Box2D Physics initialization
        Physics.init();

        // Debuggin mode setup
        Physics.debug(true);

        // First ball creating
        this.balls.first     = Object.create(this.ball).init(5, 14, -8, 4);
        window.webkitRequestAnimationFrame(function() {
            Physics.step(1/60, 1, 1);
        });
    }
}

// Application start
app.init();
