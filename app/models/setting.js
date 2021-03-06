import { later } from '@ember/runloop';
import Resource from 'ember-api-store/models/resource';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import C from 'ui/utils/constants';

export default Resource.extend({
  type:         'setting',
  modalService: service('modal'),
  settings:     service(),
  allowed:      C.SETTING.ALLOWED,
  canRemove:    false,

  actions: {
    edit() {
      let key = get(this, 'id');
      let obj =  this.get('settings').findByName(key);
      let details = this.get('allowed')[key];

      this.get('modalService').toggleModal('modal-edit-setting', {
        key: key,
        descriptionKey: `dangerZone.description.${get(this, 'id')}`,
        kind: details.kind,
        obj: obj,
        canDelete: obj && !obj.get('isDefault'),
      });
    },
    revert() {
      let key = get(this, 'id');
      let details = this.get('allowed')[key];

      this.get('modalService').toggleModal('modal-revert-setting', {
        setting: this,
        kind: details.kind,
      });
    },
    bypassRevert() {
      set(this, 'value', get(this, 'default'));

      this.save();
    },
  },

  isDefault: computed('value', 'default', function() {
    return get(this, 'default') === get(this, 'value');
  }),

  delete() {
    return this._super().then((res) => {
      later(this,'reload',500);
      return res;
    });
  },
  availableActions: computed('actionLinks.{update,remove}', function() {
    return [
      { label: 'action.revert',       icon: 'icon icon-history',          action: 'revert',       enabled: !isEmpty(get(this, 'default')) && !get(this, 'isDefault'),  altAction: 'bypassRevert' },
    ];
  }),
});
