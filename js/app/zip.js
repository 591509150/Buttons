(function(){
    'use strict';

    /*globals Unicorn, Backbone $ */

    //UTILS ZIP
    Unicorn.Utils.Zip = {
        //Hack since it appears onereadstatechange does not close over outer vars
        lastButtonsCss: '',
        generateCustomGrids: function(buttonsCss) {},
        generateCustomButtons: function(buttonsCss) {
            //So onreadystatechange can access our _options.scss via Unicorn.Utils.Zip.lastButtonsCss
            this.lastButtonsCss = buttonsCss || '';
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/Buttons/Buttons-Custom.zip', true);
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            xhr.onreadystatechange = function(e) {
                if (this.readyState == 4 && this.status == 200) {
                    // First populate zip with our skeleton Buttons-Custom.zip template
                    var zip = new JSZip(this.responseText);
                    zip.file("css/buttons.css", Unicorn.Utils.Zip.lastButtonsCss);
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
