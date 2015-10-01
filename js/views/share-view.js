/* global app*/
'use strict';
var AmpersandView = require('ampersand-view');
var _ = require('lodash');

module.exports = AmpersandView.extend({
 	template: require('../../templates/share.hbs')(),

    events: {
    	'change [data-hook=message]': 'setMessage',
    	'change [data-hook=name]': 'setName',
    	'click [data-hook=share]': 'share',
    	'click [data-hook=get-location]': 'getLocation'
    },

    setName: function (e) {
    	this.model.name = e.target.value;
    },

    setMessage: function (e) {
    	this.model.text = e.target.value;
    },

    setLocation: function (lat, lng) {
    	this.model.lat = lat;
    	this.model.lon = lng;
    },

	render: function () {
	    this.renderWithTemplate();
	    $(this.el).foundation('reveal', 'open');
	    $(this.el).on('closed.fndtn.reveal', function () {
	    	app.navigate('/map');
	    	this.remove();
	    });
	},

	getLocation: function () {
		navigator.geolocation.getCurrentPosition(_.bind(this.onLocationSuccess, this), this.onLocationError, {

		});
	},

	onLocationSuccess: function (pos) {
		this.setLocation(pos.coords.latitude, pos.coords.longitude);
	},

	onLocationError: function (error) {
		console.error(error.code);
	},

	share: function () {
		console.log(this.model.toJSON());
	},

    // subviews: {
    //     form: {
    //         // this is the css selector that will be the `el` in the
    //         // prepareView function.
    //         container: 'fieldset',
    //         // this says we'll wait for `this.model` to be truthy
    //         waitFor: 'model',
    //         prepareView: function (el) {
    //             // var model = this.model;
    //             return new MessageForm({
    //                 el: el,
    //                 model: this.model,
		  //           submitCallback: function () {
		  //           	debugger;
		  //           },
		  //         	validCallback: function (valid) {
		  //         		debugger;
			 //            if (valid) {
			 //                console.log('The form is valid!');
			 //            } else {
			 //                console.log('The form is not valid!');
			 //            }
		  //           }
    //             });
    //         }
    //     }
    // },

	remove: function () {
	    $(this.el).remove();
	}

});