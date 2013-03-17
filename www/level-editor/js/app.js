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
        app.level.data[$(this).attr('id')]          = {};
        app.level.data[$(this).attr('id')].objType  = app.selectedObjType.name;
        app.level.data[$(this).attr('id')].x        = $(this).attr('data-x');
        app.level.data[$(this).attr('id')].y        = $(this).attr('data-y');
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
    
    app.buildObjTypeSelector(objTypeName, $('.objectForm input.attr.color').val());
};

// Build obj type selector dom object
app.buildObjTypeSelector = function(name, background) {
    // Add object type in object types container
    $('<div/>', {
                id: name,
                class: 'objectType',
                style: 'background: ' + background
            }).html(name).appendTo('.objTypes')
            .click(app.selectObjType); // Add selecting handler for object type
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
            app.buildLevelBlock(i, k, 'empty', '');
            
            // Add a level block to app level data object 
            app.level.data[i + '-' + k] = {};
        }
    }
    
    // Setting level title
    app.level.title = title;
};

// Building of a level block dom element
app.buildLevelBlock = function(x, y, objType, color) {
    $('<div/>', {
        id: x + '-' + y,
        style: 'left:' + x * 25 + 'px; top:' + y * 25 + 'px; background:' + color,
        'class': 'levelBlock',
        'data-x': x,
        'data-y': y,
        title: x + '-' + y + ': ' + objType
    }).appendTo($('.level')).click(app.applyObjType);
}

// Exporting a level
app.exportLevel = function() {
    // Hide import level elements
    $('.importLevelCode, .importSubmit').hide();
    
    // Show export level textarea and prepeare an export data
    $('.levelCode').text("app.objectTypes = " + JSON.stringify(app.objectTypes) + "; app.level = " + JSON.stringify(app.level)).show();
};

// Importing a level
app.importLevel = function() {
    // Hide export level textarea
    $('.levelCode').hide();
    
    // Show import level elements
    $('.importLevelCode, .importSubmit').show();
};

// Submitting of level importing
app.importLevelSubmit = function() {
    var importCode  = $('.importLevelCode').val();
    
    // Evaluating of imported level code
    eval(importCode);
    
    // Build object types selectors
    $.each(app.objectTypes, function(key, item) {
        app.buildObjTypeSelector(item.name, item.color);    
    });
    
    // Cleanup of level dom
    $('.level').html('');
    
    // Build level
    $.each(app.level.data, function(key, item) {
        app.buildLevelBlock(item.x, item.y, item.objType, app.objectTypes[item.objType].color);
    });
};

// App initializator
app.init = function() {
    // Add buttons handlers
    $('.objTypeCreate').click(app.createObjType);
    $('.generateLevel').click(app.generateLevel);
    $('.exportLevel').click(app.exportLevel);
    $('.importLevel').click(app.importLevel);
    $('.importSubmit').click(app.importLevelSubmit);
};

// Starting an application
app.init();