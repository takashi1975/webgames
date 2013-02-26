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
                bodyType: "dynamic",
                type: "ball",
                id: data.id
            };

        // Box2D body exemplar creating
        this.body = Object.create(app.Body).init(app.Physics, details);
        this.push(data.impulseX, data.impulseY);

        // CAAT actor for ball creating
        this.actor  = new CAAT.Actor().
        setLocation(caatX, caatY).
        enableEvents(false);
    
        // Setting of a cached image to the brick
        this.image    = app.director.getImage('ballGrey');
        this.actor.setBackgroundImage(this.image, true);

        // Adding of a CAAT actor to scene
        app.scene.addChild(this.actor);
        
        // Set references to collision methods for body user data
        this.body.m_userData.contact            = this.contact;
        this.body.m_userData.collisionHandlers  = this.collisionHandlers;

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
    },
    
    // Collision handlers
    collisionHandlers: {
        // For brick
        brick: function(brick, impulse) {
            // Destroy a brick
            app.stepActionsQueue.push({object: app.bricks[brick.details.id], method: 'destroy'});
        }
    },

    // Collision handling (context this is a prototype so we could use a
    // user data stored references to a ball object methods)
    contact: function (contact, impulse, first) {
        // Get user data of collided with ball body
        var bodyA = contact.GetFixtureA().GetBody().GetUserData();

        // Get type of collided object
        var collidedObjectType  = bodyA.details.type;

        // Check if there is such collision handler for a ball in reference collisionHandlers
        if(this.collisionHandlers[collidedObjectType]) {
            // Call collision handler
            this.collisionHandlers[collidedObjectType](bodyA, impulse);
        }
    }
};
