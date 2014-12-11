$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


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
    '#/chore': {
        form: 'chore',
        controller: 'chore',
        authRequired: true // must be logged in to get here
    }
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
    rootRef.createUser(userObj, function(err) {

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
        .then(function() {
            return authWithPassword(userObj);
        });
}

/// Controllers
////////////////////////////////////////

controllers.login = function(form) {

    // Form submission for logging in
    form.on('submit', function(e) {
        e.preventDefault();
        // looks like {email: "..", password: ".."}
        var inputData = {
                email: this.querySelector('input[name="email"]').value,
                password: this.querySelector('input[name="password"]').value

            }
            //var loginPromise = createUserAndLogin(userAndPass); // is for creating a user            
        var loginPromise = authWithPassword(inputData);

        loginPromise.then(function(data) {
            // console.log('succeeded', data)
            routeTo('profile');
        }).fail(function(errorMessage) {
            createUserAndLogin(inputData).then(function() {
                routeTo('profile');
            })
        })

    });

};

controllers.profile = function(form) {
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
    userRef.once('value', function(snap) {
        var user = snap.val();
        if (!user) {
            return;
        }

        // set the fields
        form.find('#txtName').val(user.name);
        form.find('#ddlTitle').val(user.placeinfamily);
    });

    // Save user's info to Firebase
    form.on('submit', function(e) {
        e.preventDefault();
        var userInfo = $(form).serializeObject();
        userRef.set(userInfo, function onComplete() {
            // we're logged in, so now route to the chores page
            routeTo('chore')
        });
    });

};

controllers.chore = function(containerElement) {
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
    userRef.once('value', function(snap) {
        var userData = snap.val();

        // grab the template string from the DOM, and create the data to be given to the templating function
        var renderChoreView = function() {
            //debugger;
            // get an array of just the chores on Firebase that are owned by me
            var myChores = CHORES.filter(function(c) {
                return c.get('userId') === user.uid
            });
            
            // turn each model that belongs to me into a POJO {}
            myChores = myChores.map(function(c) {
                return c.toJSON();
            })

            var htmlString = _.template($("#chores-template").html(), {
                chores: myChores,
                name: userData.name
            })

            containerElement.html(htmlString);
        }

        CHORES.on("sync", renderChoreView);

        renderChoreView();

        $(chore).on('submit', function(ce) {
            ce.preventDefault();
            var data = containerElement.find("#createChoreForm").serializeObject();
            data.userId = user.uid;
            CHORES.create(data);
        })

        //debugger;
        $(containerElement).on("click", ".Delete", function() {
            // $(this).closest("li").remove();

            var el_clicked = this,
                modelId = el_clicked.getAttribute("modelId");

            CHORES.remove({ id: modelId });
            // CHORES.on('all', function(event) {
                // console.log(event);

            // });

            // $(".Delete").on("click", function() {
            //   $(this).closest("li").remove();
            //});
            // 1. handle form submit events inside containerElement
            // 2. when form submitted, create a new Chore with the information from the DOM and the userId
            // CHORES.create({ description: "vaccum living area", assignedTo: "Matt", userId: user.uid });
            // 3. whenever a <li> is clicked, delete it from the CHORES collection
            // CHORES.remove(  );
        })
    })
}

/// Routing
///////////////////////////////////////
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

/**
 * Backbone Collection / Model
 */

var Chore = Backbone.Model.extend({
    validate: function(attr) {
        if (!attr.description && !attr.assignedTo && !attr.userId) {
            return 'Chores must have a description and be assigned to someone'
        }
    }
})

var Chores = Backbone.Firebase.Collection.extend({
    model: Chore,
    url: "https://incandescent-inferno-6448.firebaseio.com/chores"
});

var CHORES = new Chores();


/// Routes
///  #/         - Login
//   #/profile  - Profile

Path.map("#/").to(prepRoute);
Path.map("#/profile").to(prepRoute);
Path.map("#/chore").to(prepRoute);
Path.root("#/");


// Start the router
Path.listen();

// whenever authentication happens send a popup
rootRef.onAuth(function globalOnAuth(authData) {
    console.log(authData)
});
