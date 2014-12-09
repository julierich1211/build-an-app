;
(function(window, undefined) {

    window.app = window.app || {};

    app.ChoresView = Backbone.View.extend({
        tagName: "div",
        className: ".choreList",
        template: $("#choreList-template").html(),
        model: app.ChoreModel,
        collection: app.ChoresCollection,
        initialize: function(options) {
            this.choresCollection = new app.ChoresCollection();
            
            this.choresCollection.fetch();
            console.dir(this.choresCollection)
            // debugger;

            this.render();
        },


        render: function(attributes) {
            debugger;
            var someHtmlString = _.template(this.template, this.choresCollection.attributes);
            console.dir(someHtmlString)
            this.el.innerHTML = _.template(this.template, this.choresCollection.attributes);
             return this;
        }

    });

    ChoresView = app.ChoresView;


})(window, undefined);