/* global app*/
'use strict';
var View = require('ampersand-view');

module.exports = View.extend({
    template: require('../../templates/chat-item.hbs'),
    
    bindings: {
        'model.text': '[data-hook~=text]',
        'model.name': '[data-hook~=name]',
        'model.timeAgo': '[data-hook~=timeAgo]'
    },

    events: {
        'click': 'showOnMap'
    },
    
    showOnMap: function () {
        app.router.trigger('message:showOnMap', this.model.toJSON());
    }
});