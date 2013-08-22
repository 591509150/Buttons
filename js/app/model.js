(function(){
    'use strict';

    /*globals Unicorn, Backbone */

    //MODEL
    Unicorn.Models.Button = Backbone.Model.extend({
        url: 'http://localhost:5000/build', //local
        //url: 'http://options-compiler.herokuapp.com/build', //production

        defaults: function() {
            return {
                '$namespace': '.button',
                '$glow_namespace': '.glow',
                '$glow_color': '#2c9adb',
                '$bgcolor': '#CCC',
                '$height': '32px',
                '$font-color': '#666',
                '$font-size': '14px',
                '$font-weight': '300',
                '$font-family': '\'HelveticaNeue-Light\', \'Helvetica Neue Light\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif',
                '$dropdown-background': '#fcfcfc',
                '$dropdown-link-color': '#333',
                '$dropdown-link-hover': '#FFF',
                '$dropdown-link-hover-background': '#3c6ab9',
                '$button_actions': {
                    primary: '#00A1CB #FFF',
                    action: '#7db500 #FFF',
                    highlight: '#F18D05 #FFF',
                    caution: '#E54028 #FFF',
                    royal: '#87318C #FFF'
                    // ... define more as you please
                },
                '$button_styles': ['rounded', 'pill', 'circle'],
                '$button_sizes': ['large', 'small', 'tiny'],
                '$circle-size': '120px'
            };
        },

        // TODO: We'll partition the css with <module_type> so we can potentially have css.buttons, css.grids etc.
        // return {css: response.css[this.type]};

        parse: function(response) {

            var styles = {css: '', options: ''};
            // parse can be invoked for fetch and save, in case of save it can be undefined so check before using
            if (response && response.buttonsCss && response.optionsScss) {
                styles.css = response.buttonsCss;
                styles.options = response.optionsScss;
                // TODO: We'll partition the css with <module_type> so we can potentially have css.buttons, css.grids etc.
                // return {css: response.css[this.type]};
            }

            return styles;
        },

        initialize: function() {


        }
    });
})();