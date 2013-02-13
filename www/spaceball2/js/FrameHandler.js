// Animation and simulation frame step handler
app.frameHandler = function(director_time) {
    // Updating balls CAAT actors rendering
    var balls = Object.keys(app.balls);
    balls.forEach(function(ballId) {
        app.balls[ballId].update();
    });

    app.Physics.step(1/60, 1, 1);
};