
window.onload = app;

// runs when the DOM is loaded
function app(){
    "use strict";

    // load some scripts (uses promises :D)
    loader.load(
        {url: "./bower_components/jquery/dist/jquery.min.js"},
        {url: "./bower_components/lodash/dist/lodash.min.js"},
        {url: "./bower_components/backbone/backbone.js"},
        {url: "./bower_components/backfire/dist/backbonefire.js"},
        {url: "./dist/login.css"},
        {url: "./dist/style.css"},
        {url: "./bower_components/pathjs/path.js"},
        {url: "./js/login.js"}
       
    ).then(function(){
        _.templateSettings.interpolate = /{([\s\S]+?)}/g;
        document.body.style.opacity = 1;
        // start app?
    })

}
    
