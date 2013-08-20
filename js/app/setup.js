(function(){
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




