/* global app, Bloodhound*/
'use strict';
var $ = require('jquery');
var _ = require('lodash');
var Firebase = require('firebase');
//todo: cannot import typeahead, tried using debowerify to no avail
// cheating by including the library in the index page for now

var SearchView = require('ampersand-view');
module.exports = SearchView.extend({
	initialize: function () {
        this.dataSet = new Firebase('https://luminous-fire-5575.firebaseio.com/users');
        // this.dataSet.on('value', _.bind(this.getMessages, this));
        this.listenTo(app.router, 'modal:hide', function () {
		    $(this.el).foundation('reveal', 'close');
        }, this);
	},

 	template: require('../../templates/search.hbs')(),

	render: function () {
	    this.renderWithTemplate();
	    $(this.el).foundation('reveal', 'open');
	    $(this.el).on('close.fndtn.reveal', function () {
	    	app.navigate('/map');
	    	this.remove();
	    });
	
		//todo: gross, fix this
		this.dataSet.on('value', _.bind(function (ss) {
			this.messages = [];
			_.each(ss.val(), function (item) { 
				_.each(item.messages, function (item2) {
					this.messages.push(item2);
				}, this);
			}, this);
			this.initTypeahead();
		}, this));
	},

	initTypeahead: function () {
		$('#search-input').typeahead('destroy');
		var bloodhound = new Bloodhound({
			datumTokenizer: function(d) { 
				return Bloodhound.tokenizers.whitespace(d.text); 
			},
			queryTokenizer: Bloodhound.tokenizers.whitespace, 
			local: this.messages 
		});
		
		bloodhound.initialize();
	    var options = {	
	    	displayKey: 'text',
	    	source: bloodhound.ttAdapter(),
	    	templates: { 
	    		suggestion: _.template('<strong><%=text%></strong>')
	    	}
	    };

	    $('#search-input').typeahead(null, options).on('typeahead:select', _.bind(function (evt, model) {
	        app.router.trigger('message:showOnMap', model);
		    $(this.el).foundation('reveal', 'close');
	    }, this));
	},

	remove: function () {
	    $(this.el).remove();
	}
});