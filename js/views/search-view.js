/* global app*/
'use strict';
var SearchView = require('ampersand-view');
//todo: why is this undefined? debowerify seems to be working as expected
var typeahead = require('typeahead.js');
module.exports = SearchView.extend({
	initialize: function () {
	},

 	template: require('../../templates/search.hbs')(),

	render: function () {
	    this.renderWithTemplate();
	    $(this.el).foundation('reveal', 'open');
	    $(this.el).on('close.fndtn.reveal', function () {
	    	app.navigate('/map');
	    	this.remove();
	    });
	    // this.initTypeahead();
	},

	initTypeahead: function () {
		$('#search-input').typeahead('destroy');
	var bloodhound = new Bloodhound({
		datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.text); },
		queryTokenizer: Bloodhound.tokenizers.whitespace, local: this.messages });
	bloodhound.initialize();
    var options = {	displayKey: 'text',	source: bloodhound.ttAdapter(),
        	templates: { suggestion: _.template('<strong><%=text%></strong>')}};
    $('#search-input').typeahead(null, options);
	},

	remove: function () {
	    $(this.el).remove();
	}
});