/* global app, L*/
'use strict';

var Firebase = require('firebase');
var AmpersandModel = require('ampersand-model');
var _ = require('lodash');

var MapModel = AmpersandModel.extend({
    initialize: function () {
        this.listenTo(app.router, 'message:showFeature', this.highlightFeature);

        this.dataSet = new Firebase('https://luminous-fire-5575.firebaseio.com/users');
        this.dataSet.on('value', _.bind(this.getMessages, this));
    },

    initMap: function () {
        this.map = L.map('map');
        //set map default view
        this.map.setView(L.latLng([39.060800, -25.503862]), 3);
        //add basemap
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 1,
            maxZoom: 18,
            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.msgLayer = L.geoJson(null, {
            pointToLayer: function (ftr, latLng) {
                return L.marker([latLng.lat, latLng.lng], {icon: L.divIcon({className: 'default-icon icon-map-marker'})});
            }
        }).addTo(this.map);

    },

    highlightFeature: function (attrs) {
        var layers = this.msgLayer.getLayers(),
            selectedIcon = L.divIcon({className: 'selected-icon icon-map-marker'}),
            defaultIcon = L.divIcon({className: 'default-icon icon-map-marker'}),
            ftr;
        
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].feature.properties.timeStamp === attrs.timeStamp) {
                ftr = layers[i];
                ftr.setIcon(selectedIcon);
            } else {
                layers[i].setIcon(defaultIcon);
            }
        }

        if (ftr) {
            var lat = ftr.feature.geometry.coordinates[1];
            var lng = ftr.feature.geometry.coordinates[0];
            this.map.setView([lat, lng], 10);
        }
    },

    getMessages: function (dataSnapshot) {
        this.messages = [];
        // parse users/messages and add to geojsonLayer
        //https://www.firebase.com/docs/web/api/datasnapshot/
        dataSnapshot.forEach(_.bind(function (user) {
            _.each(user.val().messages, function (msg) {
                this.messages.push(msg);
                this.msgLayer.addData(this.createGeoJsonPoint(msg));
            }, this);
        }, this));
    },
    
    createGeoJsonPoint: function (msg) {
        return {
            "type": "Feature",
            "properties": msg,
            "geometry": {
                "type": "Point",
                "coordinates": [msg.lon, msg.lat]
            }
        };
    }
});

module.exports = MapModel;