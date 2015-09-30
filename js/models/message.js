var AmpersandModel = require('ampersand-model');


module.exports = AmpersandModel.extend({
    props: {
        id: 'any',
        text: ['string', true, ''],
        name: ['string', true, ''],
        timeStamp: 'number'
    },
    derived: {
    	timeAgo: {
    		deps: ['timeStamp'],
    		fn: function () {
    			var tC = new Date().getTime(),
				tE = Math.floor((tC - this.timeStamp) / 1000 / 60); //get time elapsed since the previous messages in firebase
				return tS = (tE > 60) ? Math.floor((tE * 60) / 3600)  + ' hours ago' :  tE + ' minutes ago';
    		}
    	}
    },
    session: {
        selected: ['boolean', true, false]
    }
});