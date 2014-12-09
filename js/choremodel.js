;
 (function(window, undefined) {

     window.app = window.app || {};

     app.ChoreModel = Backbone.Model.extend({
         defaults: {
         	id: 'Chore',
             name: 'Vaccum',
             points: '5 Points',
             picture: 'http://comps.canstockphoto.com/can-stock-photo_csp11439880.jpg'
             
         },
         validate: function(attr) {
             if (!attr.name && !attr.points) {
                 return 'Must input a Chore and Point Value'
             }
             
         },
         intialize: function(){
         	
         }
     });


    ChoreModel = app.ChoreModel;

 })(window, undefined);