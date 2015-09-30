/* global app, L*/
'use strict';

var AmpersandModel = require('ampersand-model');
var _ = require('lodash');

var MapModel = AmpersandModel.extend({
    initialize: function () {
        this.listenTo(app.router, 'upload:featureCollection', this.addFeature);
        this.listenTo(app.router, 'nav:toggleElevation', this.toggleElevation);
    },

    initMap: function () {
        this.map = L.map('map');
        //set map default view
        this.map.setView(L.latLng([39.060800, -105.503862]), 7);
        //add basemap
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 3,
            maxZoom: 18,
            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.elevCntl = L.control.elevation();

        this.uploadLayer = L.geoJson().addTo(this.map);

        this.elevationLayer = L.geoJson(null, {
            onEachFeature: this.elevCntl.addData.bind(this.elevCntl)
        }).addTo(this.map);

    },

    addFeature: function (ftr) {
        ftr = this.parseFeatureCollection(ftr);
        this.uploadLayer.addData(ftr);
        this.map.fitBounds(this.uploadLayer.getBounds());
    },

    toggleElevation: function () {
        if (this.elevCntl.getContainer()) {
            //already visible, remove
            this.elevCntl.clear();
            this.elevCntl.removeFrom(this.map);
            this.map.removeLayer(this.elevationLayer);
            return;
        }

        //check if there are features, and they are lines
        this.elevationLayer.clearLayers();
        var uploadedLayers = this.uploadLayer.getLayers();
        this.elevationLayer.addTo(this.map);
        uploadedLayers.forEach(_.bind(function (lyr) {
            this.elevationLayer.addData(lyr.feature);
        }, this));
        this.elevCntl.addTo(this.map);
    },

    parseFeatureCollection: function (fc) {
        var lines = [];
        for (var i = 0; i < fc.features.length; i++) {
            if (fc.features[i].geometry.type === 'LineString') {
                lines.push(fc.features[i]);
            }
        }
        return lines;
    },
});

module.exports = MapModel;