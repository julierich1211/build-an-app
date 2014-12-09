;
(function(window, undefined) {
    window.app = window.app || {};

    app.Router = Backbone.Router.extend({
        routes: {
            'edit': 'editUser',
            '/': 'home'
        },

        initialize: function() {
            console.log('router working');
            

            this.appView = new app.AppView();
            this.choresCollectionView = new app.ChoresCollectionView();
            console.dir(this.choresCollectionView)
            this.choreModel = new app.ChoreModel();
           
            this.choresView = new app.ChoresView({

                collection: this.choresCollection
                
            });
            
            this.appView.$el.find('.container').append(this.choresView.el);






        }
    });



    // router.on('route:editUser', function() {


    // });

    Router = app.Router;



    Backbone.history.start();



})(window, undefined);