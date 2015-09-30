/* global app*/
'use strict';
var ShareView = require('ampersand-view');
// var Firebase = require('firebase');

module.exports = ShareView.extend({
	initialize: function () {
	},

 	template: require('../../templates/share.hbs')(),

	render: function () {
	    this.renderWithTemplate();
	    $(this.el).foundation('reveal', 'open');
	    $(this.el).on('closed.fndtn.reveal', function () {
	    	app.navigate('/map');
	    	this.remove();
	    });
	},

	remove: function () {
	    $(this.el).remove();
	}
});