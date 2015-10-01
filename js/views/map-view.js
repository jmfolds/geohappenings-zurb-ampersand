'use strict';
var MapView = require('ampersand-view');
var MapModel = require('../models/map');

module.exports = MapView.extend({
	initialize: function () {
		this.model = new MapModel();
	},

 	template: require('../../templates/map.hbs')(),

	render: function () {
	    this.renderWithTemplate();
	    this.model.initMap();
	},

	remove: function () {
		this.model.destroy();
	    $(this.el).remove();
	}
});