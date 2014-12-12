window.onload = app;

// runs when the DOM is loaded
function app() {
    "use strict";

    // load some scripts (uses promises :D)
    loader.load(
        //css
        {
            url: "./bower_components/normalize.css/normalize.css"
        }, {
            url: "./bower_components/typeplate-starter-kit/css/typeplate.css"
        }, {
            url: "./bower_components/materialize/bin/materialize.css"
        }, {
            url: "./dist/style.css"
        },

        //js

        {
            url: "./bower_components/jquery/dist/jquery.min.js"
        }, {
            url: "./bower_components/lodash/dist/lodash.min.js"
        }, {
            url: "./bower_components/firebase/firebase.js"
        }, {
            url: "./bower_components/backbone/backbone.js"
        }, {
            url: "./bower_components/backfire/dist/backbonefire.js"
        }, {
            url: "./bower_components/underscore/underscore-min.js"
        }, {
            url: "./bower_components/materialize/bin/materialize.js"
        }, {
            url: "./bower_components/pathjs/path.js"
        }, {
            url: "./js/login.js"
        }, {
            url: "./js/appView.js"
        },
        // {url: "./js/choremodel.js"},
        // {url: "./js/ChoresCollection.js"},
        // {url: "./js/ChoresCollectionView.js"},
        {
            url: "./js/ChoresView.js"
        }
        // {url: "./js/router.js"}

    ).then(function() {
        _.templateSettings.interpolate = /{([\s\S]+?)}/g;
        document.querySelector('html').style.opacity = 1;
        // start app?
    })

}
