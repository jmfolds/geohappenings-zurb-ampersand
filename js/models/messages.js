var Collection = require('ampersand-collection');
var Message = require('./message');


module.exports = Collection.extend({
    model: Message
});