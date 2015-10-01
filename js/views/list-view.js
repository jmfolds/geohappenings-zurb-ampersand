/* global app*/
'use strict';
var _ = require('lodash');
var Firebase = require('firebase');
var AmpersandView = require('ampersand-view');
var ItemView = require('./message-view');


module.exports = AmpersandView.extend({
	initialize: function () {
		this.dataSet = new Firebase('https://luminous-fire-5575.firebaseio.com/users');
		this.dataSet.on('value', _.bind(this.getMessages, this));
		this.listenTo(app.router, 'message:listClick', this.closeModal);
	},

 	template: require('../../templates/list.hbs')(),

	render: function () {
	    this.renderWithTemplate();
	    // open modal
	    $(this.el).foundation('reveal', 'open');
	    // set listener to navigate and destroy on modal close
	    $(this.el).on('closed.fndtn.reveal', function () {
	    	app.navigate('/map');
	    	this.remove();
	    });
	 	this.renderCollection(this.collection, ItemView, this.queryByHook('message-list'));

	},

	getMessages: function (dataSnapshot) {
		this.messages = [];
		// parse users/messages and list all
		//https://www.firebase.com/docs/web/api/datasnapshot/
		dataSnapshot.forEach(_.bind(function (user) {
			_.each(user.val().messages, function (msg) {
				this.messages.push(msg);
			}, this);
		}, this));
		//sort by latest timestamp
		this.messages.sort(function (a, b) { if (a.timeStamp > b.timeStamp) { return -1; }
			if (a.timeStamp < b.timeStamp) { return 1; } return 0;
		});
		this.collection.add(this.messages);
	},

	closeModal: function () {
		$(this.el).foundation('reveal', 'close');
	},

	remove: function () {
	    $(this.el).remove();
	}
});