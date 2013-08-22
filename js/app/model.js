(function(){
    'use strict';

    /*globals Unicorn, Backbone */

    //MODEL
    Unicorn.Models.Base = Backbone.Model.extend({
        module: '', //required override e.g. 'buttons', 'grids', etc.
        url: '', //required override
        initialize: function() {},
        /**
         * Precondition: Decendents of `Models.Base` MUST define `module` and `url`
         * or `parse` will not work correctly.
         * @param  {Object} response http response
         * @return {Object}          Object literal like: `{css:...,options:...}`
         */
        parse: function(response) {
            var styles = {css: '', options: ''};
            // parse can be invoked for fetch and save, in case of save it can be undefined so check before using
            if (response && response[this.module] && response.optionsScss) {
                styles.css = response[this.module];
                styles.options = response.optionsScss;
            }
            return styles;
        }
    });
    Unicorn.Models.Button = Unicorn.Models.Base.extend({
        module: 'buttons',
        //Back-end now has route /build/:module where :module will be buttons, grids, etc.
        url: 'http://localhost:5000/build/buttons',
        //url: 'http://options-compiler.herokuapp.com/build/'+this.module, //production
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
        }
    });
    // Unicorn.Models.Grid = Unicorn.Models.Base.extend({
    //     module: 'grids',
    //     url: 'http://localhost:5000/build/'+this.module,
    //     //TODO define defaults here...
    //     default: function() {
    //         return {};
    //     }
    // });
})();