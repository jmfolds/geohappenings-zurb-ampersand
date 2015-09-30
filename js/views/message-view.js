var View = require('ampersand-view');

module.exports = View.extend({
  template: require('../../templates/chat-item.hbs'),
  bindings: {
    'model.text': '[data-hook~=text]',
    'model.name': '[data-hook~=name]',
    // 'model.timeStamp': '[data-hook~=time]',
    'model.timeAgo': '[data-hook~=timeAgo]'

    // 'model.text': {
    //   type: 'attribute',
    //   hook: 'text',
    //   name: 'src'
    // },
    // 'model.name': {
    //   type: 'attribute',
    //   hook: 'name',
    //   name: 'href'
    // }
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick'
  },
  handleRemoveClick: function () {
    this.model.destroy();
    return false;
  }
});