/* global app */
'use strict';
var MapView = require('ampersand-view');
var MapModel = require('../models/map');

module.exports = MapView.extend({
	initialize: function () {
        this.listenTo(app.router, 'message:showOnMap', this.onListSelect);
        this.listenTo(app.router, 'share:selectLocation', this.selectLocation);
		this.model = new MapModel();
	},

 	template: require('../../templates/map.hbs')(),

	render: function () {
	    this.renderWithTemplate();
	    this.model.initMap();
	},

	onListSelect: function (attrs) {
		// second param is zoomTo option
		this.model.updateSelection(attrs, true);
	},

	selectLocation: function (data) {
		this.model.initMapClick(data);
	},

	remove: function () {
		this.model.destroy();
	    $(this.el).remove();
	}
});