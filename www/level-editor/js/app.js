// General object
var app = {};

// Object types generic object
app.objectTypes = {};

// Level generic object
app.level = {
    title: "default",
    data: {}
};

// Selecting object type handler
app.selectObjType = function() {
    // Selector for object type
    var selectedObjType = $('.selectedObjType');
    
    // Cleanup of selector
    selectedObjType.html('');
    
    // Creating of selected object reference
    $('<div/>', {
                obj_id: $(this).attr('id'),
                style: $(this).attr('style')
            }).html($(this).html()).appendTo(selectedObjType);

    app.selectedObjType         = app.objectTypes[$(this).attr('id')];
    app.selectedObjType.name    = $(this).attr('id');
};

// Applyinf of an object type to level block
app.applyObjType = function() {
    // If selected object is setted
    if (app.selectedObjType) {
        // Applying selected object type attributes to level block
        $(this).css({background: app.selectedObjType.color});
        var title = $(this).attr('id') + ": " + app.selectedObjType.name;
        $(this).attr('title', title);

        // Modyfiyng a level block in app level data object 
        app.level.data[$(this).attr('id')] = app.selectedObjType;
    } else {
        alert('Please select an object type!');
    }
};

// Creating a new object type
app.createObjType = function() {
    // Get the name of object type
    var objTypeName = $('.objectForm input.name').val();
    
    // Define new object type in level
    app.objectTypes[objTypeName] = {};
    
    // Reference to object type object
    var objType = app.objectTypes[objTypeName];
    
    // Add object type properties
    $('.objectForm input.attr').each(function(key, item) {
        objType[$(item).attr('name')] = $(item).val();
    });
    
    // Add object type in object types container
    $('<div/>', {
                id: objTypeName,
                class: 'objectType',
                style: 'background: ' + $('.objectForm input.attr.color').val()
            }).html(objTypeName).appendTo('.objTypes').click(app.selectObjType);
    
    // Add selecting handler for object type
    
};

// Generating of a level
app.generateLevel = function() {
    var level   = $('.level'),
        title   = $('input.levelTitle').val(),
        x       = $('input.levelX').val(),
        y       = $('input.levelY').val();

    // Clearing a level
    level.html('');
    app.level.data = {};
        
    // Building of an empty blocks in level according to level X, Y size
    for (var i = 1; i <= x; i++) { 
        for (var k = 1; k <= y; k++) {
            $('<div/>', {
                id: i + '-' + k,
                style: 'left:' + i * 25 + 'px; top:' + k * 25 + 'px;',
                class: 'levelBlock',
                title: i + '-' + k + 'empty'
            }).appendTo(level).click(app.applyObjType);
            
            // Add a level block to app level data object 
            app.level.data[i + '-' + k] = {};
        }
    }
    
    // Setting level title
    app.level.title = title;
};

// Exporting a level
app.exportLevel = function() {
    $('.levelCode').text(JSON.stringify(app.level)).show();    
};

// App initializator
app.init = function() {
    // Add buttons handlers
    $('.objTypeCreate').click(app.createObjType);
    $('.generateLevel').click(app.generateLevel);
    $('.exportLevel').click(app.exportLevel);
};

// Starting an application
app.init();