    // references for Box2D general objects for simplicity
    var b2Vec2          = Box2D.Common.Math.b2Vec2;
    var b2BodyDef       = Box2D.Dynamics.b2BodyDef;
    var b2Body          = Box2D.Dynamics.b2Body;
    var b2FixtureDef    = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture       = Box2D.Dynamics.b2Fixture;
    var b2World         = Box2D.Dynamics.b2World;
    var b2MassData      = Box2D.Collision.Shapes.b2MassData;
    var b2PolygonShape  = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape   = Box2D.Collision.Shapes.b2CircleShape;
    var b2DebugDraw     = Box2D.Dynamics.b2DebugDraw;

    // canvas creating
    var canvas  = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    document.body.appendChild(canvas);

    // world creating function wrapper
    var Physics = {
        init: function(element, scale) {
            var gravity         = new b2Vec2(0, 9.8);
            this.world          = new b2World(gravity, true);
            this.element        = element;
            this.context        = element.getContext("2d");
            this.scale          = scale || 30;
            this.dtRemaining    = 0;
            this.stepAmount     = 1 / 60;

            return this;
        },

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

        debug: function() {
            this.debugDraw = new b2DebugDraw();
            this.debugDraw.SetSprite(this.context);
            this.debugDraw.SetDrawScale(this.scale);
            this.debugDraw.SetFillAlpha(0.3);
            this.debugDraw.SetLineThickness(1.0);
            this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this.world.SetDebugDraw(this.debugDraw);
        }
    };

    // world initialization
    Physics.init(canvas);

    // body prototype
    var Body = {
        defaults: {
            shape: "block",
            width: 5,
            height: 5,
            radius: 2.5
        },

        fixtureDefaults: {
            density: 2,
            friction: 1,
            restitution: 0.2
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
            this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

            // Create the Body
            this.body = physics.world.CreateBody(this.definition);

            // Create the fixture
            this.fixtureDef = new b2FixtureDef();
            for (var l in this.fixtureDefaults) {
                this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
            }

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
                    break;
            };

            this.body.CreateFixture(this.fixtureDef);

            return this;
        }
    };

    // walls of world static
    var walls       = {};
    walls.left      = Object.create(Body).init(Physics, {type:"static", x:0.5, y:0, height:50.5,  width:1});
    walls.right     = Object.create(Body).init(Physics, {type:"static", x:32, y:0, height:50.5,  width:1});
    walls.top       = Object.create(Body).init(Physics, {type:"static", x:0, y:0.5, height:1, width:65});
    walls.bottom    = Object.create(Body).init(Physics, {type:"static", x:0, y:24.7, height:1, width:65});
    walls.plane     = Object.create(Body).init(Physics, {type:"static", x:16, y:10, height:1, width:15});

    // dynamic objects
    var balls       = {};
    balls.first     = Object.create(Body).init(Physics, {shape:"circle", x:5, y:8});
    balls.second    = Object.create(Body).init(Physics, {shape:"circle", x:13, y:8});
    balls.third     = Object.create(Body).init(Physics, {shape:"circle", x:8, y:3});

    var lastFrame = new Date().getTime();
/*
    var gameLoop = function() {
        var tm = new Date().getTime();
        webkitRequestAnimationFrame(gameLoop);
        var dt = (tm - lastFrame) / 1000;
        if (dt > 1/15) {
            dt = 1/15;
        }
        Physics.step(dt);
        lastFrame = tm;
    };
*/
    Physics.debug();
    //webkitRequestAnimationFrame(gameLoop);

    // CAAT initializing
    var director    = new CAAT.Director().initialize(1024, 768);

    var scene       = director.createScene();

    var circle      = new CAAT.ShapeActor().
            setLocation(20,20).
            setSize(60,60).
            setFillStyle('#ff0000').
            setStrokeStyle('#000000');

    scene.addChild(circle);

    director.onRenderStart= function(director_time) {
        //this.world.Step(1.0/60, 1,1);
        //this.world.ClearForces();
        //console.log('111');
        Physics.step(1/60, 1,1);
        //Physics.ClearForces();
    };

    director.loop(1);

