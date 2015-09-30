/*global app*/
'use strict';

var AmpersandView = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');


module.exports = AmpersandView.extend({
    initialize: function () {
        this.listenTo(app.router, 'page', this.handleNewPage);
    },
    // Our template function that returns an HTML string
    // this can also just be a string. Template language
    // is irrelevant. It just needs to be a function that
    // takes an argument and returns a string.
    template: require('../../templates/nav.hbs')(),

    events: {
        'click a[href]': 'handleLinkClick'
    },

    render: function () {
        // Inherited from AmpersandView, it renders the main template
        // and inserts it into the root element.
        this.renderWithTemplate();
        // set up our page switcher for that element
        this.pageSwitcher = new ViewSwitcher($('#modals')[0], {
            show: function (view) {
                // scroll to the top 
                document.body.scrollTop = 0;
                // perhaps store a reference to our current page on our 
                // app global for easy access from the browser console. 
                app.currentPage = view;
            }
        });
    },
    
    handleLinkClick: function (e) {
        var aTag = e.target;
        var local = aTag.host === window.location.host;

        // if it's a plain click (no modifier keys)
        // and it's a local url, navigate internally
        if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            app.navigate(aTag.pathname);
        }
    },

    handleNewPage: function (view) {
        this.pageSwitcher.set(view);
    }
});