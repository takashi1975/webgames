// application object defining
var app     = {
    speed: 10 // app game speed
};

// defining of a wall object
app.wall   = {
    ID: 'wall',     // default object ID
    type: 'wall',   // type of an object
    x: 0,           // left top corner X
    y: 0,           // left top corner Y
    x2: 0,          // right bottom corner X
    y2: 0,          // right bottom corner Y
    w: 10,          // width of a object
    h: 10,          // height of a object
    color: 'blue',  // color of a object
    init: function(x, y, x2, y2, color, wallId) {
        // setting ID for this wall
        this.ID         = wallId;
        
        // creating of a wall
        this.x          = x;
        this.x2         = x2;
        this.y          = y;
        this.y2         = y2;
        this.y2         = y2;
        this.w          = x2 - x;
        this.h          = y2 - y;
        this.color      = color;
        this.el         = $('<i class="wall" />');
        this.el.css({
                        top: this.y,
                        left: this.x,
                        width: this.w,
                        height: this.h,
                        background: this.color
                    });

        // add a wall element to a page
        $('body').append(this.el);
        
        // resolve a collision for a wall (adding wall obj link to the tree nodes)
        app.collision.resolve(this);

        return this;
    }
};

// defining collisions detection object
app.collision   = {
    // set a tree density in pixels
    treeDensity: 100,
    
    // defining of a tree object for optimizing of collisions detection
    tree: {},
    
    // checking of collission between two objects
    testCollision: function(obj, obj2) {
        // defining of collision type
        var collisionType   = '';
        if (obj.x <= obj2.x2 && obj.x2 >= obj2.x && obj.y <= obj2.y2 && obj.y2 >= obj2.y) {
            // collision is present
            // check top collision
            if (obj.y < obj2.y && obj.y2 < obj2.y2) {
                collisionType   += 'T';
            }
            
            // check bottom collision
            if (obj.y > obj2.y && obj.y2 > obj2.y2) {
                collisionType   += 'B';
            }
            
            // check left collision
            if (obj.x < obj2.x && obj.x2 < obj2.x2) {
                collisionType   += 'L';
            }
            
            // check right collision
            if (obj.x > obj2.x && obj.x2 > obj2.x2) {
                collisionType   += 'R';
            }
            
            if (!collisionType) {
                // it is center collision type
                collisionType += 'C';
            }
            
            return collisionType;
        } else {
            // no collission
            return false;
        }
    },
    
    // checking of collisions of object with other objects in resolved treeNodes
    checkCollisions: function(treeNodes, obj) {
        // this alias
        var self            = this;
        
        // define collisions array
        var collisions      = Array();
        
        // temporary array of already tested objects for eleminating
        // of double checking and dublicates in collisions array
        var alreadyTested   = Array();
        
        // check each resolved tree node for objects
        $(treeNodes).each(function(nodeKey, nodeItem) {
            // check if this node is not empty
            if (!$.isEmptyObject(self.tree[nodeItem])) {
                // this node is not empty
                // check each object of tree node for collision            
                $.each(self.tree[nodeItem], function(objKey, objItem) {
                    // if this object was not tested yet
                    if ($.inArray(objItem.ID, alreadyTested) == -1) {                    
                        // check collission between two objects
                        var collision   = self.testCollision(obj, objItem);
                        if (collision) {
                            // there is a collision lets add it to collisions array
                            collisions.push({
                                obj: objItem,
                                type: collision
                            });
                        }

                        // adding object to alreadyTested array
                        alreadyTested.push(objItem.ID);
                    }
                });
            }
        });
        
        // return array of collisions
        return collisions;
    },
    
    // collision detection resolving and returning objects array that has
    // collision with this object
    resolve: function(obj) {        
        // resolving in nodes tree (collision performance optimisation)
        // finding tree nodes where object is present
        var treeNodes       = this.treeResolve(obj);
        
        // defining collisions variable for returning
        var collisions;
        
        // cleaning of nodes tree from obj
        this.cleanTreeFromObject(obj);
        
        // check for collissions with other objects in resolved treeNodes
        collisions          = this.checkCollisions(treeNodes, obj);
        
        // adding object in resolved treeNodes
        this.addObjectToTreeNodes(obj, treeNodes);
        
        // return collissions as a result of resolving of collisions detection
        return collisions;
    },
    
    // removing of obj from tree nodes that saved in obj treeNodes property
    cleanTreeFromObject: function(obj) {
        // this tree alias
        var tree        = this.tree;
        
        if (obj.treeNodes) {
            // object was saved in some tree nodes, lets clean them
            $(obj.treeNodes).each(function(key, item) {
                // deleting object link from tree node
                delete tree[item][obj.ID];
            });
        }
    },
    
    // adding of object to tree nodes that has been resolved and adding resolved
    // tree nodes to treeNodes property of an object
    addObjectToTreeNodes: function(obj, treeNodes) {
        // setting resolved treeNodes to object property
        obj.treeNodes   = treeNodes;
        
        // this tree alias
        var tree        = this.tree;
        
        // adding object to tree nodes that has been resolved for this object
        $(treeNodes).each(function(key, item) {
            if (!tree[item]) {
                // need to add this tree node first
                tree[item]  = {};
            }
            
            // adding an object link to this tree node
            tree[item][obj.ID]  = obj;
        });
    },
    
    // resolving object in a tree for finding in what tree node is object placed
    // and removing object from tree nodes where object not placed any more
    treeResolve: function(obj) {
        // defining an array where obj is placed at the moment
        var treeNodes       = Array();
        
        // get top left corner of object tree node ID
        var treeNodeX_tl    = Math.floor(obj.x / this.treeDensity);
        var treeNodeY_tl    = Math.floor(obj.y / this.treeDensity);
        
        // get tree node ID for left top corner of object
        var treeNode_tl     = treeNodeX_tl + '-' + treeNodeY_tl;
        
        // get bottom right corner of object tree node ID
        var treeNodeX_br    = Math.floor(obj.x2 / this.treeDensity);
        var treeNodeY_br    = Math.floor(obj.y2 / this.treeDensity);
        
        // get tree node ID for bottom right corner of object
        var treeNode_br     = treeNodeX_br + '-' + treeNodeY_br;
        
        // check if this object is placed in one single tree node
        if (treeNode_tl == treeNode_br) {
            // object is placed in one single tree node
            treeNodes.push(treeNode_tl);
        } else {
            // object is placed in several tree nodes
            // finding all nodes where placed an object
            treeNodes   = this.findAllNodes(treeNodeX_tl, treeNodeX_br, treeNodeY_tl, treeNodeY_br);
        }
        
        return treeNodes;
    },
    
    // finding of all nodes if object placed in several (top left corner and
    // bottom right corner are placed in different tree nodes)
    // x,x2 - tree nodes start and end X ID
    // y, y2 - tree nodes start and end Y ID
    findAllNodes: function(x, x2, y, y2) {
        // define a tree nodes array
        var treeNodes   = Array(),
            nodeID;

        for (var i = y; i < (y2 + 1); i += 1) {
            for (var k = x; k < (x2 + 1); k += 1) {
                nodeID      = k + '-' + i;
                treeNodes.push(nodeID);
            }
        }
        
        // returning of tree nodes array
        return treeNodes;
    }
};

// defining of a brick
app.brick   = {
    ID: 'brick',    // default brick ID
    type: 'brick',  // type of an object
    x: 0,           // left top corner X
    y: 0,           // left top corner Y
    x2: 0,          // right bottom corner X
    y2: 0,          // right bottom corner Y
    w: 100,         // width of a brick
    h: 50,          // height of a brick
    color: 'blue',  // color of a brick
    
    // coordinates setter
    setXY: function(x,y) {
        this.x          = x;
        this.x2         = this.x + this.w;
        this.y          = y;
        this.y2         = this.y + this.h;
    },
    
    init: function(x, y, color, brickId) {
        // setting ID for this ball
        this.ID         = brickId;
        
        // creating of a brick
        this.setXY(x, y);
        this.color      = color;
        this.el         = $('<i class="brick" />');
        this.el.css({
                        top: this.y,
                        left: this.x,
                        width: this.w,
                        height: this.h,
                        background: this.color
                    });

        // add a brick element to a page
        $('body').append(this.el);
        
        // resolve a collision for a brick (adding brick link to the tree nodes)
        app.collision.resolve(this);

        return this;
    },
    
    destroy: function() {
        // this alias
        var self = this;
        
        // destroy this brick DOM element
        this.el.addClass('blast');
        var timeoutID = window.setTimeout(function() {
            self.el.remove();
        }, 1000);
        
        // remove brick object from nodes tree
        app.collision.cleanTreeFromObject(this);
        
        // update score +10 points
        app.statistics.updateScore(10);
        
        // destroy this object
        delete app.bricks[this.ID];
        delete this;
    }
};

// ball object defining
app.ball    = {
    ID: 'ball',         // default object ID
    type: 'ball',       // type of an object
    x: 100,             // default left top corner X
    y: 300,             // default left top corner Y
    x2: 0,              // right bottom corner X (will be calculated automatically)
    y2: 0,              // right bottom corner Y (will be calculated automatically)
    w: 30,              // default width of a ball
    h: 30,              // default height of a ball
    speed: 2,           // speed of a ball
    speedX: 0,          // default horizontal speed of a ball
    speedY: 0,          // default vertical speed of a ball
    angle: 45,          // angle of a ball direction
    directionX: 1,      // direction of a horizontal flying of a ball (left to right)
    directionY: -1,     // direction of a vertical flying of a ball (bottom to top)
    color: '#A2A2A2',   // color of a ball
    
    // coordinates setter
    setXY: function(x,y) {
        this.x          = x;
        this.x2         = this.x + this.w;
        this.y          = y;
        this.y2         = this.y + this.h;
    },    

    fly: function() {
        // calculation of horizontal and vertical speed components of a ball
        // according to angle and general speed
        this.speedX = this.speed * Math.cos(this.angle / 180 * Math.PI);
        this.speedY = this.speed * Math.sin(this.angle / 180 * Math.PI);

        // calculating of new coordinates of a ball
        var newX    = this.x + this.directionX * this.speedX * this.speed;
        var newY    = this.y + this.directionY * this.speedY * this.speed;

        // setting new ball coordinates
        this.setXY(newX, newY);
    },
    
    // changing of ball flying direction according to collision type with object
    changeBallFlyingDirection: function(item) {
        // check type of collision
        switch (item.type) {
            case 'T':
                this.directionY = -1;
                break;
            case 'B':
                this.directionY = 1;
                break;
            case 'L':
                this.directionX = -1;
                break;
            case 'R':
                this.directionX = 1;
                break;
            case 'TL':
                this.directionY = -1;
                this.directionX = -1;
                break;
            case 'TR':
                this.directionY = -1;
                this.directionX = 1;
                break;
            case 'BL':
                this.directionY = 1;
                this.directionX = -1;
                break;
            case 'BR':
                this.directionY = 1;
                this.directionX = 1;
                break;
            default:
                console.log('unknown collission???');
                break;
        }
    },
    
    // collision for brick handling
    brickCollision: function(item) {
        // sound for collision
        app.sounds.play('brick');
        
        // ball fly direction changing
        this.changeBallFlyingDirection(item);

        // destroying a brick
        item.obj.destroy();
        
        // check for winning the game (no more bricks on field left)
        if (!Object.keys(app.bricks).length) {
            // go to the next level (level + 1)
            app.statistics.updateLevel(1);
            
            // ball coordinates to rocket position setting
            var ballX  = app.rocket.x + app.rocket.w / 2 - 10;
            var ballY  = app.rocket.y - 20;
            this.setXY(ballX, ballY);
        }
    },    
    
    // collision for rocket handling
    rocketCollision: function(item) {
        // sound for collision
        app.sounds.play('rocket');
        
        // ball fly direction changing
        this.changeBallFlyingDirection(item);
        
        // check if ball change angle after rocket top collision
        if (item.type == 'T' || item.type == 'TR' || item.type == 'TL') {
            // top collision of a ball and a rocket
            // check how far from the middle of rocket balll have a collision
            var rocketMiddlePointX  = app.rocket.x + app.rocket.w / 2;
            var ballMiddlePointX    = this.x + this.w / 2;
            var distance            = parseInt(rocketMiddlePointX - ballMiddlePointX);
            if (distance < 0) {
                // ball at the right point of a rocket
                // lets change ball flying direction to the right
                this.directionX = 1;
            } else if (distance > 0) {
                // ball at the left point of a rocket
                // lets change ball flying direction to the left
                this.directionX = -1;
            }
            
            // get max possible distance
            var maxDistance         = app.rocket.w / 2 + this.w / 2;
            
            // defining max possible angle of ball flying after collision
            var maxAngle            = 90;
            
            // get new angle of ball flying
            var newAngle            = (maxDistance - Math.abs(distance)) * maxAngle / maxDistance;
            
            // new angle cannot be less than 20
            if (newAngle < 20) {
                newAngle            = 20;
            }
            
            // set new angle to the ball
            this.angle              = newAngle;
        }
    },
    
    // check for ball loosing
    wallCollision: function(item) {
        if(item.obj.ID == 'wall-bottom') {
            // ball is lost in the bottom wall
            this.destroy();
            
            // check for loosing of last ball
            if (!Object.keys(app.balls).length) {
                // last ball is lost                
                // update lives -1 live
                app.statistics.updateLives(-1);
                
                // check if it was the last ball than the game is over
                if (app.statistics.lives < 1) {
                    app.messages.show('GAME OVER... HA HA HA!!!', function() {});
                } else {
                    // add one ball to the game
                    var newBallX            = app.rocket.x + app.rocket.w / 2 - 10;
                    var newBallY            = app.rocket.y - 20;
                    app.balls['ball-1']     = Object.create(app.ball).init('ball-1', newBallX, newBallY);
                }
            }
        } else {
            // sound for collision
            app.sounds.play('wall');
            
            // ball fly direction changing
            this.changeBallFlyingDirection(item);
        }
    },

    checkCollisions: function() {
        // this alias
        var self        = this;
        
        // defining a collisions variable for a ball
        var collisions;
        
        // resolve a collision of a ball
        collisions      = app.collision.resolve(this);
        
        if (collisions.length > 0) {
            // there are some sollissions, lets handle them
            $(collisions).each(function(key, item) {
                // check type of object which has a collision
                switch (item.obj.type) {
                    case 'rocket':
                        self.rocketCollision(item);
                        break;
                    case 'brick':
                        self.brickCollision(item);
                        break;
                    case 'wall':
                        self.wallCollision(item);
                        break;
                }
            });
        }
    },

    draw: function() {
        // draw a ball in new position
        this.fly();
        this.checkCollisions();
        this.el.css({left: this.x, top: this.y});
    },

    init: function(ID, x, y) {
        // setting ID for this ball
        this.ID        = ID;
        
        // setting coordinates of a ball
        this.setXY(x, y);

        // create a ball HTML element
        this.el         = $('<i class="ball" />');
        this.el.css({
                        top: this.y,
                        left: this.x,
                        width: this.w,
                        height: this.h
                        //background: this.color
                    });

        // add a ball element to a page
        $('body').append(this.el);
        
        return this;
    },
    
    // destroying of a ball
    destroy: function() {        
        // this alias
        var self    = this;
        
        // destroy this ball DOM element
        this.el.addClass('blast');
        var timeoutID = window.setTimeout(function() {
            self.el.remove();
        }, 100000);
        
        // remove brick object from nodes tree
        app.collision.cleanTreeFromObject(this);
        
        // destroy this object
        delete app.balls[this.ID];
        delete this;
    }
};

app.messages     = {
    show: function(text, callback) {
        var messageEl   = this.el;
        messageEl.html(text).show();

        var timeoutID = window.setTimeout(function() {
            messageEl.hide();
            callback();
        }, 3000);
        
        return this;
    },
    init: function() {
        // create a message HTML element
        this.el         = $('<div class="message" />');
        
        // add a message element to a page
        $('body').append(this.el);
        
        return this;
    }
};


// define a rocket
app.rocket      = {
    ID: 'rocket',       // default object ID
    type: 'rocket',     // type of an object
    x: 400,             // default left top corner X
    y: 500,             // default left top corner Y
    x2: 0,              // right bottom corner X (will be calculated automatically)
    y2: 0,              // right bottom corner Y (will be calculated automatically)
    w: 200,             // default width of a ball
    h: 50,              // default height of a ball
    color: '#2C003E',   // color of a rocket
    
    // coordinates setter
    setXY: function(x,y) {
        this.x          = x;
        this.x2         = this.x + this.w;
        this.y          = y;
        this.y2         = this.y + this.h;
    },
    
    // initialization method    
    init: function() {
        // this rocket alias
        var self        = this;

        // rocket coordinates setting
        this.setXY(this.x, this.y);

        // create a ball HTML element
        this.el         = $('<i class="rocket" />');
        this.el.css({
                        top: this.y,
                        left: this.x,
                        width: this.w,
                        height: this.h,
                        background: this.color
                    });

        // add a rocket element to a page
        $('body').append(this.el);
        
        // resolve a collision for a rocket (adding brick link to the tree nodes)
        app.collision.resolve(this);

        // add mouse move listener for a rocket moving
        $(window).mousemove(function(e) {
            // calculate new rocket coordinates (new Y is an old value)
            var newX    = e.pageX - self.w/2;
            self.setXY(newX, self.y);
        });
    },
    
    // draw a rocket in new position
    draw: function() {
        // this alias
        var self        = this;
        
        // defining of a variable for a new X position of a rocket
        var newX;
        
        // walls boundries handling
        if (this.x <= app.walls.left.x2) {
            // left wall collision
            newX    = app.walls.left.x2;
            this.setXY(newX, this.y);
        }
        
        if (this.x2 >= app.walls.right.x) {
            // right wall collision
            newX    = app.walls.right.x - this.w;
            this.setXY(newX, this.y);
        }
        
        // resolve a collision for a rocket
        var collisions  = app.collision.resolve(this);
        
        // setting of new coordinates to rocket element
        this.el.css("left", this.x);     
    }
};

app.statistics   = {
    score: 0,       // game score
    lives: 3,       // default lives (0 - game over)
    level: 1,       // default level
    maxLevels: 4,   // maximum of levels for game over
    init: function() {
        // create a score HTML element
        this.scoreEl         = $('<b class="score" />');
        this.scoreEl.html("Score: " + this.score);
        
        // create a score HTML element
        this.livesEl         = $('<b class="lives" />');
        this.livesEl.html("Lives: " + this.lives);
        
        // create a level HTML element
        this.levelEl         = $('<b class="level" />');
        this.levelEl.html("Level: " + this.level);
        
        // adding level CSS class to the body
        $('body').addClass('level-' + this.level);
        
        // add a score, level and lives elements to a page
        $('body').append(this.livesEl, this.scoreEl, this.levelEl);
    },
    
    // updating score
    updateScore: function(points) {
        this.score += points;
        this.scoreEl.html("Score: " + this.score);
    },
    
    // updating lives
    updateLives: function(live) {
        this.lives += live;
        this.livesEl.html("Lives: " + this.lives);
    },
    
    // updating level
    updateLevel: function(level) {
        // removing of level CSS classes from body
        $('body').removeClass('level-' + this.level);
        
        // updating a level
        this.level += level;
        this.levelEl.html("Level: " + this.level);
        
        if (this.level > this.maxLevels) {
            // player is win (finished last max level)
            alert('Congratulations, you win!');
        } else {
            // building new bricks field
            app.buildBricksField();
            
            // next level
            // adding level CSS class to the body
            $('body').addClass('level-' + this.level);
            
            // update ball prototype speed
            app.ball.speed  += 0.25;
        }
    }
},

// building of bricks field
app.buildBricksField    = function() {
    app.bricks      = {};
    for (var i = 0; i < 3; i += 1) {
        for (var k = 0; k < 9; k += 1) {
            var brickId         = 'brick-' + k + '-' + i;
            var red             = parseInt(Math.random() * 256);
            var green           = parseInt(Math.random() * 256);
            var blue            = parseInt(Math.random() * 256);
            var color           = 'rgba(' + red + ', ' + green + ', ' + blue + ', 1)';
            app.bricks[brickId] = Object.create(app.brick).init(k * 100 + 50, i * 50 + 50, color, brickId);
        }
    }
},

// sound effects
app.sounds  = {
    // defining of audio context
    context: new webkitAudioContext(),
    
    // loading errors handler
    onError: function() {
        console.warn('file loading error');
    },
    
    // loading sound method
    loadSound: function(url, snd) {
        //var url     = app.sounds[sound];
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function() {
            app.sounds.context.decodeAudioData(request.response, function(buffer) {
                app.sounds[snd] = buffer;
            }, app.sounds.onError);
        }
        
        // sending request for loading
        request.send();
    },
    
    // sound playing method    
    play: function(snd) {
        var soundBuffer     = app.sounds[snd];
        if (soundBuffer) {
            // sound buffer is fully loaded and ready to play
            var source = app.sounds.context.createBufferSource();   // creates a sound source
            source.buffer = soundBuffer;                            // tell the source which sound to play
            source.connect(app.sounds.context.destination);         // connect the source to the context's destination (the speakers)
            source.noteOn(0);                                       // play the source now
        }
    },
    
    
    // sounds initialization
    init: function() {
        // loading sounds
        app.sounds.loadSound("snd/2.mp3", "brick");
        app.sounds.loadSound("snd/1.mp3", "rocket");
        app.sounds.loadSound("snd/3.mp3", "wall");
    }
},

// app initialization method
app.init    = function() {
    // first run ball initialization
    var ballX                   = app.rocket.x + app.rocket.w / 2 - 10;
    var ballY                   = app.rocket.y - 20;
    app.balls                   = {};
    app.balls['ball-1']         = Object.create(app.ball).init('ball-1', ballX, ballY);
    app.balls['ball-2']         = Object.create(app.ball).init('ball-2', ballX, ballY);
    app.balls['ball-3']         = Object.create(app.ball).init('ball-3', ballX, ballY);

    // first run rocket initialization
    app.rocket.init();

    // building of bricks field
    app.buildBricksField();    
    
    // defining of game field walls boundries
    app.walls   = {
        top: Object.create(app.wall).init(0, 0, 1000, 50, 'red', 'wall-top'),
        left: Object.create(app.wall).init(0, 50, 50, 600, 'blue', 'wall-left'),
        right: Object.create(app.wall).init(950, 50, 1000, 600, 'green', 'wall-right'),
        bottom: Object.create(app.wall).init(0, 600, 1000, 650, 'orange', 'wall-bottom')
    };
    
    // statistics initialization
    app.statistics.init();
    
    // sounds initialization
    app.sounds.init();
    
    // messages initialization
    app.messages.init();
};

// defining a timer actions that need to be handled with time intervals
app.timerAction = function() {
    // defining of a new rocket position variable
    var newRocketX;
    
    // draw a rocket in new position
    app.rocket.draw();

    // drawing a balls in new positions
    $.each(app.balls, function(key, item) {
        // drawing a specific ball in new position
        app.balls[key].draw();
    });
    
    // demo mode
    if (app.demo) {
        // demo mode is enabled
        $(window).unbind('mousemove');
        newRocketX  = app.balls['ball-1'].x - app.rocket.w / 2 + Math.random(100) * 100 - Math.random(100) * 100;
        app.rocket.setXY(newRocketX, app.rocket.y);
    }
};

// defining timer for app with actions that need to be handled with time
app.timer       = setInterval(app.timerAction, app.speed);

// gamepad initialization
var gamepad = new Gamepad();
if (!gamepad.init()) {
    // Your browser does not support gamepads, get the latest Google Chrome or Firefox
} else {
    gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
        // first gamepad handling
        newRocketX      = app.rocket.x + gamepads[0].state['RIGHT_STICK_X'] * 20;
        app.rocket.setXY(newRocketX, app.rocket.y);
    });
}

// application initialization
app.init();
