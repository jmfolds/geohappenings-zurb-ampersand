/* global app*/
'use strict';
var $ = require('jquery');

var AmpersandView = require('ampersand-view');
var _ = require('lodash');
var Firebase = require('firebase');

module.exports = AmpersandView.extend({
	initialize: function () {
		this.dataSet = new Firebase('https://luminous-fire-5575.firebaseio.com/users');
        this.listenTo(app.router, 'modal:hide', function () {
		    $(this.el).foundation('reveal', 'close');
        }, this);
	},
 	template: require('../../templates/share.hbs')(),

    events: {
    	'change [data-hook=message]': 'setMessage',
    	'change [data-hook=name]': 'setName',
    	'click [data-hook=share]': 'saveMessage',
    	'click [data-hook=get-location]': 'getLocation',
    	'click [data-hook=select-location]': 'selectLocation'
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

    selectLocation: function () {
    	app.router.trigger('share:selectLocation', {
    		view: this,
    		data: this.model.toJSON(),
    		callback: _.bind(function (loc, data) {
    			this.model.lat = loc.lat;
    			this.model.lon = loc.lng;
    			this.model.name = data.name;
    			this.model.text = data.text;
    			this.queryByHook('name').value = data.name;
    			this.queryByHook('message').value = data.text;
    		}, this)
    	});
	    $(this.el).foundation('reveal', 'close');
    },

	render: function () {
	    this.renderWithTemplate();
	    $(this.el).foundation('reveal', 'open');
	    $(this.el).on('close.fndtn.reveal', function () {
	    	app.navigate('/map');
	    	this.remove();
	    });
	},

	saveMessage: function () {
		var lat = this.model.lat;
		var lng = this.model.lon;
		var name = this.model.name;
		var text = this.model.text;
		var exists;
		if (!lat || !lng || !name || !text) {
			window.alert("You're missing some things.");
			return;
		}
		// todo: need to figure out the firebase magic here
		// checking if user already exists, or else creating new one?
		this.dataSet.on('value', function (ss) {
			exists = ss.val() !== null;
		});
		if(!exists) {
			this.dataSet.child(name).set({text: name});
		}
		this.dataSet.child(name).child('messages').push({ 
			name: name,
			text: text,
			lat: lat,
			lon: lng,
			timeStamp: new Date().getTime() 
		});
	    $(this.el).foundation('reveal', 'close');
	},

	getLocation: function () {
		navigator.geolocation.getCurrentPosition(
			_.bind(this.onLocationSuccess, this),
			_.bind(this.onLocationError, this), {
				timeout: '10000',
				maximumAge: '0'
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