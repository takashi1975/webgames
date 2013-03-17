// Balls container
app.balls = {};

// Ball prototype
app.ball = {
    // Defining of timeout before ball pushing into the game (seconds)
    timeOutTime: 3,
    
    // Ball constructor
    init: function(data) {
        var caatX   = data.x * app.scale - data.radius * app.scale,
            caatY   = data.y * app.scale - data.radius * app.scale,
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
        this.push(data.angle, data.speed);

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
        this.body.m_userData.objReference       = this;

        return this;
    },
    
    // Timeout before pushing a ball in the game
    timeOutBeforePush: function() {
        var self = this;
        
        // Track the rocket position and set it to the ball
        this.updatePreprocess = function() {
            // Stop the ball
            this.stop();
            
            // Get horizontal distance between a ball and a rocket
            var distance = app.rocket.body.m_xf.position.x - this.body.m_xf.position.x;
            
            // Push ball to the rocket direction
            if (distance > 0) {
                this.push(0, Math.abs(distance) * 10);
            } else {
                this.push(180, Math.abs(distance) * 10);
            }
        };
        
        // Remove updatePreprocess with rocket tracking and push the ball after some time
        this.pushTimeOut = window.setTimeout(function() {
            self.updatePreprocess = function() {};
            self.push(45, 8);
        }, this.timeOutTime * 1000);
        
        return this;
    },
    
    // Preprocess for a ball update rendering handler
    updatePreprocess: function() {
        
    },

    // Updating of ball CAAT actor location according to Box2D body location
    update: function() {
        // Update preprocess for a ball before rendering
        this.updatePreprocess();
        
        var x = parseInt((this.body.m_xf.position.x - this.body.m_userData.details.radius) * app.scale),
            y = parseInt((this.body.m_xf.position.y - this.body.m_userData.details.radius) * app.scale);

        this.actor.setLocation(x, y);
    },

    // Stops ball flying
    stop: function() {
        this.body.SetLinearVelocity(new app.b2Vec2(0,0));
    },

    // Adding an impulse to a ball with specific vector
    push: function(angle, speed) {        
        // Converting angle to radians and calculating an impulse
        var radians     = angle * 3.14 / 180,
            impulseX    = speed * Math.cos(radians),
            impulseY    = -speed * Math.sin(radians);
            
        // Apply impulse to this ball body
        this.body.ApplyImpulse({x:impulseX, y:impulseY}, this.body.GetWorldCenter());
        
        // Set speed as a property of this ball object
        this.speed  = speed;
    },
    
    // Collision handlers
    collisionHandlers: {
        // For brick
        brick: function(brick, ball, impulse) {
            // Destroy a brick
            app.stepActionsQueue.push({object: app.bricks[brick.details.id], method: 'destroy'});
        },
        
        // For a rocket (ricochet)
        rocket: function(rocket, ball, impulse) {
            // Check if ball is hitting rocket on the top
            if (ball.body.m_xf.position.y < rocket.body.m_xf.position.y) {
                // The ball is hit the rocket on the top
            
                // Get distance between rockat and a ball centers
                var distance = ball.body.m_xf.position.x - rocket.body.m_xf.position.x;

                // Get half width of a rocket for new angle trigonometric calculation
                var rocketHalfWidth = rocket.body.GetUserData().details.width / 2;

                // Get tangent of new angle for a ball
                var tanAngle    = rocketHalfWidth / distance;

                // Get new angle for a ball in degrees
                var angleDegrees       = app.deg(Math.atan(tanAngle));

                // Left direction angle adjustment
                if (angleDegrees < 0) {
                    angleDegrees = (90 + angleDegrees) + 90;
                }            

                // Stop the ball
                ball.objReference.stop();

                // Pushing a ball with an old speed but in a new direction angle
                ball.objReference.push(angleDegrees, ball.objReference.speed);
            }
        }
    },

    // Collision handling (context this is a prototype so we could use a
    // user data stored references to a ball object methods)
    contact: function (contact, impulse, first) {
        // Get user data of collided with ball body
        var bodyA = contact.GetFixtureA().GetBody().GetUserData();
        
        // Get user data of this ball body
        var bodyB = contact.GetFixtureB().GetBody().GetUserData();

        // Get type of collided object
        var collidedObjectType  = bodyA.details.type;

        // Check if there is such collision handler for a ball in reference collisionHandlers
        if(this.collisionHandlers[collidedObjectType]) {
            // Call collision handler
            this.collisionHandlers[collidedObjectType](bodyA, bodyB, impulse);
        }
    }
};
