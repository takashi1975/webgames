// Animation and simulation frame step handler
app.frameHandler = function(director_time) {
    // Updating balls CAAT actors rendering
    var balls = Object.keys(app.balls);
    balls.forEach(function(ballId) {
        app.balls[ballId].update();
    });

    // Updating of rocket rendering and position
    app.rocket.update();
    
    // Evaluating of application actions queue
    for (key in app.stepActionsQueue) {
        var object  = app.stepActionsQueue[key].object;
        var method  = app.stepActionsQueue[key].method;
        object[method]();
    }
    
    // clearing of application actions queue
    app.stepActionsQueue = [];

    // Next physics step handling
    app.Physics.step(1/60, 1, 1);
};