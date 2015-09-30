/* global app*/
'use strict';
var _ = require('lodash');
var UploadView = require('ampersand-view');
var Model = require('ampersand-model');

module.exports = UploadView.extend({
	initialize: function () {
		this.model = new Model();
	},

 	template: require('../../templates/upload.hbs')(),

 	events: {
 		'change input': 'onFileChange'
 	},

    	//todo: handle improper file inputs
    	// add multi file support
    	// add support for .shp / .gpx



	render: function () {
	    this.renderWithTemplate();
	    $(this.el).foundation('reveal', 'open');
	    $(this.el).on('closed.fndtn.reveal', function () {
	    	app.navigate('/map');
	    	this.remove();
	    });
	},

    onFileChange: function (evt) {
    	var files = evt.target.files;
    	this.uploadedFilesLength = files.length;
    	_.each(files, function (file) {
    		if (!this.verifyFile(file)) {
    			files = _.without(files, file);
    			this.uploadedFilesLength--;
    			console.warn('Removed improper file type.');
    		} else {
    			this.readFile(file);
    		}
    	}, this);
    },

    readFile: function (file) {
        // Read selected file using HTML5 File API
        var fileReader = new FileReader();
        var callback = _.bind(this.onFileLoad, this);
        fileReader.onload = _.bind(function (evt) {
            this.uploadedFilesLength--;
            callback(evt.target.result);
        	if (!this.uploadedFilesLength) {
			    $(this.el).foundation('reveal', 'close');
        	}
        }, this);
        fileReader.onerror = _.bind(function () {
        	this.uploadedFilesLength--;
        	if (!this.uploadedFilesLength) {
			    $(this.el).foundation('reveal', 'close');
        	}
        }, this);
        fileReader.readAsText(file);
    },

    verifyFile: function (file) {
    	var ext = file.name.split('.').pop();
    	if (ext !== 'geojson') {
    		return false;
    	}
    	return true;
    },

    onFileLoad: function (file) {
    	//error handling
    	app.router.trigger('upload:featureCollection', JSON.parse(file));
    },

	remove: function () {
	    $(this.el).remove();
	}
});