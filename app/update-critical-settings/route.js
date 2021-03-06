import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import C from 'ui/utils/constants';

export default Route.extend({
  access:      service(),
  settings:    service(),
  globalStore: service(),

  activate() {
    $('BODY').addClass('container-farm');
  },

  deactivate() {
    $('BODY').removeClass('container-farm');
  },

  model: function() {
    let globalStore = get(this, 'globalStore');

    return globalStore.find('setting', C.SETTING.SERVER_URL).then((serverUrl) => {
      return {
        serverUrl: get(serverUrl, 'value') || window.location.host,
        serverUrlSetting: serverUrl,
      };
    });
  },
});
