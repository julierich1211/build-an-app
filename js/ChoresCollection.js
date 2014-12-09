;
(function(window, undefined) {

    window.app = window.app || {};


    app.ChoresCollection = Backbone.Firebase.Collection.extend({
        model: app.ChoreModel,
        url: "https://incandescent-inferno-6448.firebaseio.com/",
        initialize: function() {
        	
        }

    });

    ChoresCollection = app.ChoresCollection;






})(window, undefined);