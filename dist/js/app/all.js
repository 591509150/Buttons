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

        var params = {
            type: 'POST',
            dataType: 'jsonp',
            data: model.toJSON(method, model),
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

    /*globals Unicorn, Backbone $ */

    //UTILS ZIP
    Unicorn.Utils.Zip = {
        //Hack since it appears onereadstatechange does not close over outer vars
        lastButtonsArgs: {},
        generateCustomGrids: function(buttonsCss, optionsScss) {},
        generateCustomButtons: function(buttonsCss, optionsScss) {
            //So onreadystatechange can access our _options.scss via Unicorn.Utils.Zip.lastButtonsArgs
            this.lastButtonsArgs.buttonsCss = buttonsCss || '';
            this.lastButtonsArgs.optionsScss = optionsScss || '';

            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/Buttons/Buttons-Custom.zip', true);
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            xhr.onreadystatechange = function(e) {
                if (this.readyState == 4 && this.status == 200) {
                    // First populate zip with our skeleton Buttons-Custom.zip template
                    var zip = new JSZip(this.responseText);
                    zip.file("css/buttons.css", Unicorn.Utils.Zip.lastButtonsArgs.buttonsCss);
                    zip.file("scss/partials/_options.scss", Unicorn.Utils.Zip.lastButtonsArgs.optionsScss);
                    try {
                        // Blob
                        console.log('generating blob');
                        var blob = zip.generate({type:"blob"});
                        // The Download button we start with
                        var downloadButton = $('.button-download a');
                        // The Buttons-Customs.zip we'll replace Download with
                        var blobLink = $('.button-generated a');
                        var generatedWrap = $('.button-generated');
                        $(blobLink).attr('download', 'Buttons-Custom.zip');
                        $(blobLink).attr('href', window.URL.createObjectURL(blob));
                        $(downloadButton).hide();
                        $(generatedWrap).removeClass("hide");
                    } catch(e) {
                        blobLink.innerHTML += " (not supported on this browser)";
                    }
                }
            };
            xhr.send();
        }
    };
})();
;(function(){
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
})();;(function(){
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

            //TODO: Just to ensure our model changes so we do jsonp/sync while we're "spiking"
            this.model.set('remove_me_later', Math.floor(Math.random()*100));
            //TODO: Remove above!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            this.model.save();
        },

        download: function(e) {
            e.preventDefault();
            var url = 'http://localhost:5000/download/buttons?';
            var data = this.model.toJSON();
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