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

   

    // world creating function wrapper
    var Physics = {
        init: function(scale) {
            //var gravity         = new b2Vec2(0, 9.8);
            var gravity         = new b2Vec2(0, 0);
            this.world          = new b2World(gravity, true);
            //this.element        = element;
            //this.context        = element.getContext("2d");
            this.scale          = scale || 30;
            this.dtRemaining    = 0;
            this.stepAmount     = 1 / 60;
            
            this.collision();

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
        
        collision: function () {
            this.listener = new Box2D.Dynamics.b2ContactListener();
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

        debug: function(flag) {
            if (flag) {
                // debugging is enabled
                // removing of CAAT canvas
                var caatCanvas  = document.querySelectorAll('canvas')[0];
                caatCanvas.parentNode.removeChild(caatCanvas);
                
                // adding canvas for debugging
                // canvas creating
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

    // world initialization
    Physics.init();

    // body prototype
    var Body = {
        defaults: {
            shape: "block",
            width: 5,
            height: 5,
            //radius: 2.5
            radius: 0.3
        },

        fixtureDefaults: {
            density: 2,
            //friction: 1,
            friction: 0,
            //restitution: 0.2
            restitution: 1
        },

        definitionDefaults: {
            active: true,
            allowSleep: true,
            angle: 0,
            angularVelocity: 0,
            awake: true,
            //bullet: false,
            bullet: true,
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
            switch (details.type) {
                case "static":
                    this.definition.type = b2Body.b2_staticBody;
                    break;
                case "brick":
                    this.definition.type = b2Body.b2_staticBody;
                    break;
                default:
                    this.definition.type = b2Body.b2_dynamicBody;
                    break;
            }

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
            
            this.contact = function (contact, impulse, first) {                
                if (first) {
                    var bodyA = contact.GetFixtureA().GetBody().GetUserData();
                    // first collision
                    //console.log('collision', bodyA, first);
                    if (bodyA.details.type == 'brick') {
                        //console.log('collision', bodyA, first);
                        destroyQueue.push(bodyA);
                    }
                    
                }
            };

            return this.body;
        }
    };
    
    // destroying queue
    var destroyQueue    = Array();
    
    //Physics.world.DestroyBody(walls.top);

    // dynamic objects
    var balls       = {};
    balls.first     = Object.create(Body).init(Physics, {shape:"circle", x:5, y:14});
    balls.second    = Object.create(Body).init(Physics, {shape:"circle", x:13, y:18});
    balls.third     = Object.create(Body).init(Physics, {shape:"circle", x:8, y:13});
    balls.third.ApplyImpulse({ x: 10, y: 8 }, balls.third.GetWorldCenter());
    balls.first.ApplyImpulse({ x: -8, y: 4 }, balls.first.GetWorldCenter());
    balls.second.ApplyImpulse({ x: 8, y: -6 }, balls.second.GetWorldCenter());

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

    //webkitRequestAnimationFrame(gameLoop);

    // CAAT initializing
    var director    = new CAAT.Director().initialize(1024, 768);

    var scene       = director.createScene();

    var circle      = new CAAT.ShapeActor().
            setLocation(20,20).
            setSize(18, 18).
            setFillStyle('red').
            setStrokeStyle('#333333');

    scene.addChild(circle);
    
    var circle2     = new CAAT.ShapeActor().
            setLocation(20,20).
            setSize(18, 18).
            setFillStyle('green').
            setStrokeStyle('#333333');
        
    scene.addChild(circle2);
    
    var circle3     = new CAAT.ShapeActor().
            setLocation(20,20).
            setSize(18, 18).
            setFillStyle('blue').
            setStrokeStyle('#333333');
        
    scene.addChild(circle3);
    
    // walls of world static
    var walls       = {};
    walls.left      = Object.create(Body).init(Physics, {type:"static", x:0.5, y:0, height:50.5,  width:1, id: "left"});
    walls.right     = Object.create(Body).init(Physics, {type:"static", x:32, y:0, height:50.5,  width:1, id: "right"});
    walls.top       = Object.create(Body).init(Physics, {type:"static", x:0, y:0.5, height:1, width:65, id: "top"});
    walls.bottom    = Object.create(Body).init(Physics, {type:"static", x:0, y:24.7, height:1, width:65, id: "bottom"});
    
    var bricks      = {};
    var bricks_caat = {};
    
    for (var i = 1; i < 11; i += 1) {
        for (var k = 1; k < 5; k += 1) {
            var brick_id = i + '-' + k;
            bricks[brick_id]        = Object.create(Body).init(Physics, {type:"brick", x:i * 3, y: k + 1, height:1,  width:3, id: brick_id});
            
            bricks_caat[brick_id]   = new CAAT.ShapeActor().
            setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).
            setLocation(i * 3 * 30 - 45, (k + 1) * 30 - 15).
            setSize(3 * 30, 30).
            setFillStyle('blue').
            setStrokeStyle('#333333');
            scene.addChild(bricks_caat[brick_id]);
        }
    }
    
    // rocket
    var rocket = {
        x: 16,
        y: 21,
        body: Object.create(Body).init(Physics, {type:"static", x:16, y:21, height:1, width:5, id: "rocket"}),
        actor: new CAAT.ShapeActor().
            setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).
            setLocation((this.x * 30 - 5 * 30), 21 * 30).
            setSize(5 * 30, 30).
            setFillStyle('orange').
            setStrokeStyle('#333333')
    };
    
    scene.addChild(rocket.actor);

    var moveRocket  = function(e) {
        if (e.x < 110) {
            rocket.x = 110 / 30;
        } else if (e.x > 860) {
            rocket.x = 860 / 30;
        } else {
            rocket.x = e.x / 30;
        }
    };
    
    scene.mouseMove = moveRocket;    
    scene.mouseClick = moveRocket;
    scene.mouseDrag = moveRocket;
    
    
    
    director.onRenderStart= function(director_time) {
        //this.world.Step(1.0/60, 1,1);
        //this.world.ClearForces();
        //console.log('111');
        // destroying of objects in destroyQueue
        for (key in destroyQueue) {
          //console.log(destroyQueue[key]); 
          Physics.world.DestroyBody(destroyQueue[key].body);
          delete bricks[destroyQueue[key].details.id];
          
          // CAAT actor destroying
          scene.removeChild(bricks_caat[destroyQueue[key].details.id]);
        }
        
        rocket.body.SetPosition(new b2Vec2(rocket.x, 21));
        rocket.actor.setLocation(rocket.x * 30 - 2.5 * 30, 21 * 30);
        
        //console.log(Object.keys(bricks).length);
        
        if (Object.keys(bricks).length < 1) {
            console.log('YOU WIN!');
        };
        
        // cleaning destroying queue
        destroyQueue    = Array();
        Physics.step(1/60, 1, 1);
        //console.log(balls.first.body.m_xf.position.x);
        circle.setLocation(balls.first.m_xf.position.x * 30, balls.first.m_xf.position.y * 30);
        circle2.setLocation(balls.second.m_xf.position.x * 30, balls.second.m_xf.position.y * 30);
        circle3.setLocation(balls.third.m_xf.position.x * 30, balls.third.m_xf.position.y * 30);
        //console.log(balls.third.body.m_userData.details.radius);
        //Physics.ClearForces();
    };

    director.loop(1);
    
    // enabling or disabling debug mode Physics.debug(true/false);
    Physics.debug(false);

