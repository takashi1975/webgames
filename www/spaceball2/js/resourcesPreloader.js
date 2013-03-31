/*
 * Preloader of application resources
 * - images, sound, music
 * 
 */

app.loadResources = function() {
    // Sounds resources preloading
    for (var sndId in app.resources.snd) {
        // Load and audio file and adding to the director
        app.director.addAudio(sndId, app.resources.snd[sndId]);
    }
    
    // Music resources preloading
    for (var musicId in app.resources.music) {
        // Load a music file and adding to the director
        app.director.addAudio(musicId, app.resources.music[musicId]);
    }
    
    var imgArray = [];
    
    // Images resources array creating
    for (var imgId in app.resources.img) {
        imgArray.push({id: imgId, url:app.resources.img[imgId]});
    }
    
    // Images preloading
    new CAAT.ImagePreloader().loadImages(imgArray,
        function(counter, images) {
            console.log('Loading of ' + images[counter - 1].id);
            if (counter == images.length) {
                // Caching of loaded images in director object
                app.director.setImagesCache(images);
                
                // Level creating
                app.createLevel(1);
                
                // Adding of handler for each frame of animation and simulation
                app.director.onRenderStart = app.frameHandler;
            }
        }
    );
}