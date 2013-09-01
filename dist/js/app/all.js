/*
 *  Project: Buttons
 *  Description: A highly customizable CSS button library built with Sass and Compass
 *  Author: Alex Wolfe
 *  License: Apache License v2.0
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
(function ( $, window, document, undefined ) {
    'use strict';

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var menuButton = 'menuButton';
    var defaults = {
        propertyName: 'value'
    };

    // The actual plugin constructor
    function Plugin( element, options ) {

        //SET OPTIONS
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = menuButton;

        //REGISTER ELEMENT
        this.$element = $(element);

        //INITIALIZE
        this.init();
    }

    Plugin.prototype = {
        constructor: Plugin,

        init: function() {
            // WE DON'T STOP PROPGATION SO CLICKS WILL AUTOMATICALLY
            // TOGGLE AND REMOVE THE DROPDOWN & OVERLAY
            this.toggle();
        },

        //function(el, options) are avaialble in toggle method
        toggle: function() {
            if(this.$element.data('dropdown') === 'show') {
                this.hideMenu();
            }
            else {
                this.showMenu();
            }
        },

        showMenu: function() {
            this.$element.data('dropdown', 'show');
            this.$element.find('ul').show();

            if(this.$overlay) {
                this.$overlay.show();
            }
            else {
                this.$overlay = $('<div class="button-overlay"></div>');
                this.$element.append(this.$overlay);
            }
        },

        hideMenu: function() {
            this.$element.data('dropdown', 'hide');
            this.$element.find('ul').hide();
            this.$overlay.hide();
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[menuButton] = function ( options ) {
        return this.each(function () {

            // TOGGLE BUTTON IF IT EXISTS
            if ($.data(this, 'plugin_' + menuButton)) {
                $.data(this, 'plugin_' + menuButton).toggle();
            }
            // OTHERWISE CREATE A NEW INSTANCE
            else {
                $.data(this, 'plugin_' + menuButton, new Plugin( this, options ));
            }
        });
    };


    //DELEGATE CLICK EVENT FOR DROPDOWN MENUS
    $(document).on('click', '[data-buttons=dropdown]', function(e) {
        var $dropdown = $(e.currentTarget);
        $dropdown.menuButton();
    });

    //IGNORE CLICK EVENTS FROM DISPLAY BUTTON IN DROPDOWN
    $(document).on('click', '[data-buttons=dropdown] > a', function(e) {
        e.preventDefault();
    });

})( jQuery, window, document);;(function(){
    'use strict';

    /*globals Backbone, _, $ */


    ////////////////////////////////////////////////
    // BACKBONE CUSTOM SETTINGS ////////////////////
    ////////////////////////////////////////////////

    Backbone.emulateHTTP = true;

    Backbone.sync = function(method, model, options) {
        options = options || {};
        // `model.generate` will provide proper data object
        // in the structure that's expected by server.
        var data = model.generate();

        var params = {
            type: 'POST',
            dataType: 'jsonp',
            data: data,
            url: model.url,
        };

        var data = _.extend(params, options);

        return $.ajax(data);
    };



    ////////////////////////////////////////////////
    // APP NAMESPACE ///////////////////////////////
    ////////////////////////////////////////////////
    window.Unicorn = {
        Models: {},
        Views: {},
        Utils: {}
    };

})();




;(function(){
    'use strict';

    /*globals Unicorn, Backbone _ */

    //MODEL
    Unicorn.Models.Base = Backbone.Model.extend({
        module: '', //required override e.g. 'buttons', 'grids', etc.
        url: '', //required override
        // Black listed properties to omit when building http requests
        // from model. Used by `generate` callback.
        blackList: ['css', 'options'],
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
        },
        /**
         * `generate` is a required callback that must be implemented by "sub-classes"
         * of Unicorn.Models.Base, and must generate an object with the following
         * properties:
         * <pre>
         * {
         *     _options: <valid_options_scss>,
         *     _module: <valid_module_scss>,
         *     name: <module_name>
         * }
         * </pre>
         * A recommended approach to build these for example might use Array.join like:
         * <pre>
         * var css = [];
         *     css.push('$uni-btn-namespace: "' + namespace + '";')
         *     css.push('$uni-btn-bgcolor: ' + bgColor + ';');
         *     css.push('$uni-btn-height: ' + height + ';');
         *     css.push("$uni-btn-font-family: '" + fontFamily + "';");
         *     css.push('$uni-btn-dropdown-background: ' + dropdownBackground + ';');
         *     return css.join('\n');
         * </pre>
         * @return {Object} Object with strings for the _options.scss and _<MODULE>.scss
         * that can be compiled via `compass compile`
         */
        generate: function() {
            // NO-OP ... this method MUST be overriden
            throw new Error('Generate not implemented!');
        },
        /**
         * Generates a simple css property as string
         * @param  {String}  k        Key
         * @param  {String}  v        Value
         * @param  {Boolean} isQuoted Whether the value needs to be quoted
         * @return {String}           css string
         */
        generateSimpleProperty: function(k, v, isQuoted) {
            if (!k || !v) return;
            if (isQuoted) {
                return k +": '"+v+"';";
            }
            return k +': '+v+';';
        }
    });
    Unicorn.Models.Button = Unicorn.Models.Base.extend({
        module: 'buttons',
        //Back-end now has route /build/:module where :module will be buttons, grids, etc.
        url: 'http://localhost:5000/build/buttons',
        //url: 'http://options-compiler.herokuapp.com/build/'+this.module, //production
        defaults: function() {
            return {
                '$uni-btn-namespace': '.button',
                '$uni-btn-glow_namespace': '.glow',
                '$uni-btn-glow_color': '#2c9adb',
                '$uni-btn-bgcolor': '#CCC',
                '$uni-btn-height': '32px',
                '$uni-btn-font-color': '#666',
                '$uni-btn-font-size': '14px',
                '$uni-btn-font-weight': '300',
                '$uni-btn-font-family': '\'HelveticaNeue-Light\', \'Helvetica Neue Light\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif',
                '$uni-btn-dropdown-background': '#fcfcfc',
                '$uni-btn-dropdown-link-color': '#333',
                '$uni-btn-dropdown-link-hover': '#FFF',
                '$uni-btn-dropdown-link-hover-background': '#3c6ab9',
                '$uni-btn-actions': {
                    primary: '#00A1CB #FFF',
                    action: '#7db500 #FFF',
                    highlight: '#F18D05 #FFF',
                    caution: '#E54028 #FFF',
                    royal: '#87318C #FFF'
                    // ... define more as you please
                },
                '$uni-btn-styles': ['rounded', 'pill', 'circle', 'dropdown', 'glow', 'flat'],
                '$uni-btn-sizes': ['large', 'small', 'tiny'],
                '$uni-btn-circle-size': '120px'
            };
        },
        /**
         * Example of a custom module's implementation of generate. We place the burden
         * on the module author to generate this, which in turn, adds flexibility. All
         * that's required really, is that they provide properties for _options and
         * _<module> that are "compilable" by issuing `compass compile`.
         * @return {Object} A valid `generate` object (@see Unicorn.Models.Base.generate)
         */
        generate: function() {
            var self = this;
            var css = [];
            var json = this.toJSON();
            // We need to loops through these so black list them from the simple
            // key: value properties we're about to generate
            var blackList = this.blackList.concat(['$uni-btn-actions', '$uni-btn-sizes', '$uni-btn-styles']);
            var mustQuoteList = ['$uni-btn-namespace', '$uni-btn-glow-namespace'];

            // First work with simple props that we don't have to quote
            var simpleProps = _.omit(json, blackList);
            _.each(_.omit(simpleProps, mustQuoteList), function(v, k) {
                css.push(self.generateSimpleProperty(k, v));
            });

            // These have to be quoted
            _.each(_.pick(simpleProps, mustQuoteList), function(v, k) {
                css.push(self.generateSimpleProperty(k, v, true));
            });

            // Now we manually build our more complex properties
            // Button Actions
            var buttonActions = '';
            _.each(json['$uni-btn-actions'], function(v, k) {
                buttonActions += "('" +k+ "' " +v+ ") ";
            });
            buttonActions += ';';
            css.push('$uni-btn-actions: ' + buttonActions);

            // Button Styles
            var buttonStyles = '';
            _.each(json['$uni-btn-styles'], function(v, k) {
                buttonStyles += "'" + v + "' ";
            });
            buttonStyles += ';';
            css.push('$uni-btn-styles: ' + buttonStyles);

            // Button Sizes
            var buttonSizes = '';
            _.each(json['$uni-btn-sizes'], function(v, k) {
                buttonSizes += "'" + v + "' ";
            });
            buttonSizes += ';';
            css.push('$uni-btn-sizes: ' + buttonSizes);
            return {name: this.module, _options: css.join('\n')};
        }
    });
})();
;(function(){
    'use strict';

    /*globals Unicorn, Backbone, $ */

    //MENU BAR
    Unicorn.Views.Menu = Backbone.View.extend({
        events: {
            'click .button-download a': 'download',
            'click .button-jsonp a': 'build'
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
            console.log(data);
        },

        build: function(e) {
            e.preventDefault();
            this.model.save();
        },

        download: function(e) {
            e.preventDefault();
            var url = 'http://localhost:5000/download/buttons?';
            var data = this.model.generate('buttons');
            url += $.param(data);
            console.log("URL: ", url);
            window.open(url, 'Download');
        }

    });
})();;(function(){
    'use strict';

    /*globals Unicorn, Backbone, escape, prettyPrint */

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
            //GET UPDATED ATTRIBUTES
            var attrs = this.model.toJSON();

            //UPDATE BUTTONS AND CODE SAMPLE
            this.updateButtons(attrs);
            this.updateCodePreview(attrs);

            return this;
        },

        updateButtons: function(attributes) {

        },

        updateCodePreview: function(attributes) {
            var encodedHTML = this._encodeHTML(this.gallery.html());
            this.codebox.html(encodedHTML);
            prettyPrint();
        },

        _encodeHTML: function(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
    });
})();;(function(){
    'use strict';

    /*globals Unicorn, Backbone, _, $, prettyPrint*/


    //APP CONTROLLER
    Unicorn.Views.App = Backbone.View.extend({

        initialize: function() {
            this.listenTo(this.model, 'change', this.updateGlobalStyles);

            this.render();
        },

        render: function() {

            //CREATE MENU BAR
            this.menubar = new Unicorn.Views.Menu({
                el: $('.menu-bar'),
                model: this.model
            });

            //ACTIVATE SHOWCASE VIEWS
            this.showcases = $('.showcase');
            _.each(this.showcases, this.createShowCase, this);

            return this;
        },

        createShowCase: function(showcase) {
            new Unicorn.Views.Showcase({
                model: this.model,
                el: showcase
            });
        },

        updateGlobalStyles: function() {
            var css = this.model.get('css');
            var styleTag = $('#custom-styles');
            styleTag.text(css);

            prettyPrint();
        },
    });




    //START APP ON PAGE LOAD
    $(document).ready(function(){
        prettyPrint();

        new Unicorn.Views.App({model: new Unicorn.Models.Button()});
    });
})();



;$(document).ready(function(){

    //CREATE PAGE METHODS
    var page = {
        init: function() {
            this.buttons = $('#main-nav a');

            this.activateNav();
            this.disableDemoButtons();
        },

        activateNav: function() {
            var that = this;

            this.buttons.click(function(e) {
                e.preventDefault();
                var currentButton = $(e.currentTarget);
                var buttonId = currentButton.attr('href');

                //DESELECT ALL BUTTONS & SELECT CURRRENT ONE
                that.buttons.parent().removeClass('selected');
                currentButton.parent().addClass('selected');

                //ANIMATE SCROLL EFFECT
                $("html, body").animate({
                    scrollTop: $(buttonId).offset().top - 100
                }, 'slow');

            });
        },

        disableDemoButtons: function() {
            $('.showcase [href^=#]').on('click', function(e) {
                e.preventDefault();
            });
        }
    };

    //INITIALIZE PAGE
    page.init();
});