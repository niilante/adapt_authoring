define(function(require){

  var Backbone = require('backbone');
  var Handlebars = require('handlebars');
  var OriginView = require('coreJS/app/views/originView');
  var Origin = require('coreJS/app/origin');

  var PluginTypeView = OriginView.extend({

    tagName: 'div',

    className: 'pluginType-item tb-row',

    events: {
      'change .plugin-toggle-enabled': 'toggleEnabled',
      'click  .plugin-update-check': 'checkForUpdates',
      'click  .plugin-update-confirm': 'updatePlugin'
    },

    preRender: function () {
      this.listenTo(this, 'remove', this.remove);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    toggleEnabled: function () {
      // api call to disable/enable item
      this.model.set('_isAvailableInEditor', this.$('.plugin-toggle-enabled').is(':checked'));
      this.model.save();
    },

    checkForUpdates: function (event) {
      event.preventDefault();
      var btn = this.$('.plugin-update-check');
      if (btn.hasClass('disabled')) {
        return false;
      }

      btn.html(window.polyglot.t('app.checking'));
      $.ajax({
        'method': 'GET',
        'url': this.model.urlRoot + '/checkversion/' + this.model.get('_id')
      }).done(function (data) {
        if (data.isUpdateable) {
          btn.removeClass('plugin-update-check').addClass('plugin-update-confirm').html(window.polyglot.t('app.updateplugin'));
        } else {
          btn.addClass('disabled');
          btn.html(window.polyglot.t('app.uptodate'));
        }
      });

      return false;
    },

    updatePlugin: function (event) {
      event.preventDefault();
      var btn = this.$('.plugin-update-confirm');
      if (btn.hasClass('disabled')) {
        return false;
      }

      btn.html(window.polyglot.t('app.updating'));
      btn.addClass('disabled');

      // hit the update endpoint
      $.ajax({
        'method': 'GET',
        'url': this.model.urlRoot + '/update',
        'data': {
          'targets': [this.model.get('_id')]
        }
      }).done(function (data) {
        if (_.contains(data.targets), this.model.get('_id')) {
          btn.html(window.polyglot.t('app.uptodate'));
        } else {
          btn.html(window.polyglot.t('app.updatefailed'));
        }
      });

      return false;
    }

  }, {
    template: 'pluginType'
  });

  return PluginTypeView;

});