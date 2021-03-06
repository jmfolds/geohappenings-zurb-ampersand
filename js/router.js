'use strict';
var Router = require('ampersand-router');
var SearchView = require('./views/search-view');
var ListView = require('./views/list-view');
var ShareView = require('./views/share-view');
var AboutView = require('./views/about-view');
var Messages = require('./models/messages');
var Message = require('./models/message');


module.exports = Router.extend({
  routes: {
    '': 'map',
    'list': 'list',
    'search': 'search',
    'share': 'share',
    'about': 'about',
    'map': 'map'
  },

  // ------- ROUTE HANDLERS ---------
  list: function () {
    this.trigger('page', new ListView({
      model: new Message(),
      collection: new Messages()
    }));
  },
  search: function () {
    this.trigger('page', new SearchView());
  },
  share: function () {
    this.trigger('page', new ShareView({
      model: new Message()
    }));
  },
  about: function () {
    this.trigger('page', new AboutView());
  },
  map: function () {
    this.trigger('modal:hide');
  }
});