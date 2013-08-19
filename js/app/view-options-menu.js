(function(){
    'use strict';

    /*globals Unicorn, Backbone */

    //MENU BAR
    Unicorn.Views.Menu = Backbone.View.extend({
        events: {
            'click .button-download a': 'download'
        },

        initialize: function() {
            //REGISTER ELEMENTS
            this.listenTo(this.model, 'change', this.updateComplete);

            this.render();
        },

        render: function() {
            return this;
        },

        updateComplete: function() {
            var data = this.model.toJSON();
            if (data && data.css) {
                Unicorn.Utils.Zip.generateCustomButtons(data.css);
            }
            console.log(data);
        },

        download: function(e) {
            e.preventDefault();

            this.model.save();
        }

    });
})();