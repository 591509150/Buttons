(function(){
    'use strict';

    /*globals Unicorn, Backbone */

    //CODE EXAMPLE VIEW
    Unicorn.Views.Showcase = Backbone.View.extend({

        initialize: function() {
            //REGISTER ELEMENTS
            this.codebox = this.$('pre');
            this.gallery = this.$('.gallery');

            //LISTEN FOR CHANGES ON THE MODEL THEN RE-RENDER
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            var attrs = this.model.toJSON();

            this.updateButtons(attrs);
            this.updateCodePreview(attrs);

            return this;
        },

        updateButtons: function(attributes) {

        },

        updateCodePreview: function(attributes) {
            debugger;
            this.codebox.html(this.model.toJSON());


        }
    });
})();