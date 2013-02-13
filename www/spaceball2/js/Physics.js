// References for Box2D general objects for simplicity
app.b2Vec2              = Box2D.Common.Math.b2Vec2;
app.b2BodyDef           = Box2D.Dynamics.b2BodyDef;
app.b2Body              = Box2D.Dynamics.b2Body;
app.b2FixtureDef        = Box2D.Dynamics.b2FixtureDef;
app.b2Fixture           = Box2D.Dynamics.b2Fixture;
app.b2World             = Box2D.Dynamics.b2World;
app.b2MassData          = Box2D.Collision.Shapes.b2MassData;
app.b2PolygonShape      = Box2D.Collision.Shapes.b2PolygonShape;
app.b2CircleShape       = Box2D.Collision.Shapes.b2CircleShape;
app.b2DebugDraw         = Box2D.Dynamics.b2DebugDraw;
app.b2ContactListener   = Box2D.Dynamics.b2ContactListener;

// Box2D general physics object
app.Physics = {
    // World creation constructor
    init: function(scale) {
        var gravity         = new app.b2Vec2(0, 0);
        this.world          = new app.b2World(gravity, true);
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
        }
        
        if (this.debugDraw) {
            this.world.DrawDebugData();
        }
    },

    // Collisions handling
    collision: function () {
        this.listener = new app.b2ContactListener();
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
            canvas.width        = app.canvas.w;
            canvas.height       = app.canvas.h;
            canvas.setAttribute("class", "debug");
            document.body.appendChild(canvas);

            this.element        = canvas;
            this.context        = canvas.getContext("2d");

            this.debugDraw = new app.b2DebugDraw();
            this.debugDraw.SetSprite(this.context);
            this.debugDraw.SetDrawScale(this.scale);
            this.debugDraw.SetFillAlpha(0.3);
            this.debugDraw.SetLineThickness(1.0);
            this.debugDraw.SetFlags(app.b2DebugDraw.e_shapeBit | app.b2DebugDraw.e_jointBit);
            this.world.SetDebugDraw(this.debugDraw);

            console.log('DEBUG MODE ENABLED');
        } else {
            console.log('CAAT MODE ENABLED');
        }
    }
};