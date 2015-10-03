/* global app*/
'use strict';
var $ = require('jquery');

var AboutView = require('ampersand-view');

module.exports = AboutView.extend({
	initialize: function () {
        this.listenTo(app.router, 'modal:hide', function () {
		    $(this.el).foundation('reveal', 'close');
        }, this);
	},

 	template: require('../../templates/about.hbs')(),

	render: function () {
	    this.renderWithTemplate();
	    $(this.el).foundation('reveal', 'open');
	    $(this.el).on('close.fndtn.reveal', function () {
	    	app.navigate('/map');
	    	this.remove();
	    });
	},

	remove: function () {
	    $(this.el).remove();
	}
});