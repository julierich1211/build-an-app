;
(function(window, undefined) {

    app.ChoresCollectionView = Backbone.View.extend({
        el: document.querySelector('.choreList'),
        intialize: function() {
            this.choresCollection = new app.ChoresCollection();
            console.log(this.choresCollection)

        }

    });
    ChoresCollectionView = app.ChoresCollectionView;

})(window, undefined);