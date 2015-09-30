/* global app*/
'use strict';
var AboutView = require('ampersand-view');

module.exports = AboutView.extend({
	initialize: function () {
	
	},

 	template: require('../../templates/about.hbs')(),

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