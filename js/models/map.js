'use strict';

var Firebase = require('firebase');
var AmpersandModel = require('ampersand-model');
var _ = require('lodash');
var L = require('leaflet');
var PopupTemplate = require('../../templates/popup.hbs');


var MapModel = AmpersandModel.extend({
    initialize: function () {
        this.popupTemplate = PopupTemplate;
        this.popup = L.popup();
        this.dataSet = new Firebase('https://luminous-fire-5575.firebaseio.com/users');
        this.dataSet.on('value', _.bind(this.getMessages, this));
    },

    initMap: function () {
        this.map = L.map('map');
        //set map default view
        this.map.setView(L.latLng([39.060800, -25.503862]), 3);
        //add basemap
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 2,
            maxZoom: 18,
            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        // geojson layer to hold the message markers
        this.msgLayer = L.geoJson(null, {
            onEachFeature: _.bind(this.onEachFeature, this),
            pointToLayer: function (ftr, latLng) {
                return L.marker([latLng.lat, latLng.lng], {icon: L.divIcon({className: 'default-icon icon-map-marker'})});
            }
        }).addTo(this.map);

        this.map.on('popupclose', _.bind(function () {
            // clear selection when popup closes
            this.updateSelection();
        }, this));
    },

    updateSelection: function (attrs, zoomTo) {
        var layers = this.msgLayer.getLayers(),
            selectedIcon = L.divIcon({className: 'selected-icon icon-map-marker'}),
            defaultIcon = L.divIcon({className: 'default-icon icon-map-marker'}),
            selectedFtr = false;

        for (var i = 0; i < layers.length; i++) {
            //if attributes, set the selected feature (TODO: fix using timeStamp as ID)
            if (attrs && layers[i].feature.properties.timeStamp === attrs.timeStamp) {
                layers[i].setIcon(selectedIcon);
                selectedFtr = layers[i];
            } else {
                layers[i].setIcon(defaultIcon);
            }
        }

        if (selectedFtr && zoomTo) {
            var lat = selectedFtr.feature.geometry.coordinates[1];
            var lng = selectedFtr.feature.geometry.coordinates[0];
            var zoom = this.map.getZoom() > 8 ? this.map.getZoom(): 8;
            this.map.setView([lat, lng], zoom);
            this.openPopup(selectedFtr);

        }
        return selectedFtr;
    },

    initMapClick: function (data) {
        this.map.on('click', _.bind(function (evt) {
            this.map.off('click');
            data.view.render();
            data.callback(evt.latlng, data.data);
        }, this));
    },

    getMessages: function (dataSnapshot) {
        this.messages = [];
        this.msgLayer.clearLayers();
        this.map.closePopup();
        // parse users/messages and add to geojsonLayer
        //https://www.firebase.com/docs/web/api/datasnapshot/
        dataSnapshot.forEach(_.bind(function (user) {
            _.each(user.val().messages, function (msg) {
                // add elapsed time TODO: shouldnt be doing this here
                msg.timeAgo = this.getElapsedTime(msg.timeStamp);
                this.messages.push(msg);
                this.msgLayer.addData(this.createGeoJsonPoint(msg));
            }, this);
        }, this));
    },
    
    //todo: shouldn't be doing this here
    getElapsedTime: function (timestamp) {
        //get time elapsed since the previous messages in firebase
        var tC = new Date().getTime(),
        tE = Math.floor((tC - timestamp) / 1000 / 60);
        return (tE > 60) ? Math.floor((tE * 60) / 3600)  + ' hours ago' :  tE + ' minutes ago';
    },

    openPopup: function (ftr) {
        // send ftr props to popupTemplate to get HTML string
        var html = this.popupTemplate(ftr.feature.properties);
        // set the popup's location and html content
        this.popup.setLatLng(ftr.getLatLng()).setContent(html);
        this.map.openPopup(this.popup);
        this.updateSelection(ftr.feature.properties);
    },

    onEachFeature: function (ftr, layer) {
        layer.on('click', _.bind(function (evt) {
            this.openPopup(evt.target);
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