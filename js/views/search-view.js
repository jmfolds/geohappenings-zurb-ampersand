/* global app*/
'use strict';
var SearchView = require('ampersand-view');
var typeahead = require('typeahead.js');

module.exports = SearchView.extend({
	initialize: function () {
	},

 	template: require('../../templates/search.hbs')(),

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