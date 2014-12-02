//var ref = new Firebase("https://cnxy0ni0wzu.firebaseio.com");
(function (jQuery, Firebase, Path) {
    "use strict";

    // the main firebase reference
    window.rootRef = new Firebase('https://incandescent-inferno-6448.firebaseio.com/');

    // pair our routes to our form elements and controller
    var routeMap = {
        '#/': {
            form: 'loginForm',
            controller: 'login'
        },
        '#/profile': {
            form: 'profile',
            controller: 'profile',
            authRequired: true // must be logged in to get here
        },
    };

    // create the object to store our controllers
    var controllers = {};

    // store the active form shown on the page
    var activeForm = null;

    function routeTo(route) {
        window.location.href = '#/' + route;
    }

    // Handle Email/Password login
    // returns a promise
    function authWithPassword(userObj) {
        var deferred = $.Deferred();
        rootRef.authWithPassword(userObj, function onAuth(err, user) {
            if (err) {
                deferred.reject(err);
            }

            if (user) {
                deferred.resolve(user);
            }

        });

        return deferred.promise();
    }

    // create a user but not login
    // returns a promsie
    function createUser(userObj) {
        var deferred = $.Deferred();
        rootRef.createUser(userObj, function (err) {

            if (!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }

        });

        return deferred.promise();
    }

    // Create a user and then login in
    // returns a promise
    function createUserAndLogin(userObj) {
        return createUser(userObj)
            .then(function () {
            return authWithPassword(userObj);
        });
    }

    /// Controllers
    ////////////////////////////////////////

    controllers.login = function (form) {

        // Form submission for logging in
        form.on('submit', function (e) {
            e.preventDefault();
            // looks like {email: "..", password: ".."}
            var inputData = {
                email: this.querySelector('input[name="email"]').value,
                password: this.querySelector('input[name="password"]').value
            }
            //var loginPromise = createUserAndLogin(userAndPass); // is for creating a user            
            var loginPromise = authWithPassword(inputData);

            loginPromise.then(function(data){
                // console.log('succeeded', data)
                routeTo('profile');
            }).fail(function(errorMessage){
                createUserAndLogin(inputData).then(function(){
                    routeTo('profile');
                })
            })

        });

    };

    controllers.profile = function (form) {
        // Check the current user
        var user = rootRef.getAuth();
        var userRef;

        // If no current user send to register page
        if (!user) {
            routeTo('register');
            return;
        }

        // Load user info
        userRef = rootRef.child('users').child(user.uid);
        userRef.once('value', function (snap) {
            var user = snap.val();
            if (!user) {
                return;
            }

            // set the fields
            form.find('#txtName').val(user.name);
            form.find('#ddlDino').val(user.favoriteDinosaur);
        });

        // Save user's info to Firebase
        form.on('submit', function (e) {
            e.preventDefault();
            var userInfo = $(this).serializeObject();

            userRef.set(userInfo, function onComplete() {

                // show the message if write is successful
                showAlert({
                    title: 'Successfully saved!',
                    detail: 'You are still logged in',
                    className: 'alert-success'
                });

            });
        });

    };

    /// Routing
    ////////////////////////////////////////

    // Handle transitions between routes
    function transitionRoute(path) {
        // grab the config object to get the form element and controller
        var formRoute = routeMap[path];
        var currentUser = rootRef.getAuth();

        // if authentication is required and there is no
        // current user then go to the register page and
        // stop executing
        if (formRoute.authRequired && !currentUser) {
            routeTo('');
            return;
        }

        // wrap the upcoming form in jQuery
        var upcomingForm = $('#' + formRoute.form);

        // if there is no active form then make the current one active
        if (!activeForm) {
            activeForm = upcomingForm;
        }

        // hide old form and show new form
        activeForm.hide();
        upcomingForm.show().hide().fadeIn(750);

        // remove any listeners on the soon to be switched form
        activeForm.off();

        // set the new form as the active form
        activeForm = upcomingForm;

        // invoke the controller
        controllers[formRoute.controller](activeForm);
    }

    // Set up the transitioning of the route
    function prepRoute() {
        transitionRoute(this.path);
    }


    /// Routes
    ///  #/         - Login
    //   #/profile  - Profile

    Path.map("#/").to(prepRoute);
    Path.map("#/profile").to(prepRoute);
    Path.root("#/");

    /// Initialize
    ////////////////////////////////////////

    $(function () {

        // Start the router
        Path.listen();

        // whenever authentication happens send a popup
        rootRef.onAuth(function globalOnAuth(authData) {
            console.log(authData)
        });

    });

}(window.jQuery, window.Firebase, window.Path))