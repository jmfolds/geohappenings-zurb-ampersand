/* global $, L */
'use strict';
var $ = require('jquery');
var L = require('leaflet');

var Router = require('./router');
var NavView = require('./views/nav-view');
var MapView = require('./views/map-view');
var domReady = require('domready');

module.exports = {
  // this is the the whole app initter
  blastoff: function () {
    var self = window.app = this;

    // init our URL handlers and the history tracker
    this.router = new Router();

    // wait for document ready to render our main views
    // this ensures the document has a body, etc.
    domReady(function () {
      // init our nav view
      var navView = self.view = new NavView({
        el: $('#nav')[0]
      });
      // init mapview
      var mapView = new MapView({
      	el: $('#map')[0]
      });

      // ...and render
      navView.render();
      mapView.render();

      // we have what we need, we can now start our router and show the appropriate page
      self.router.history.start({pushState: false, root: '/'});
    });
  },

  // This is how you navigate around the app.
  // this gets called by a global click handler that handles
  // all the <a> tags in the app.
  // it expects a url without a leading slash.
  // for example: "costello/settings".
  navigate: function (page) {
    var url = (page.charAt(0) === '/') ? page.slice(1) : page;
    this.router.history.navigate(url, { trigger: true });
  }
};

// run it
module.exports.blastoff();