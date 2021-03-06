import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';

let notFound={};

export default Component.extend({
  layout,
  globalStore:        service(),

  // Principal or id+parsedExternalType
  principal:          null,
  parsedExternalType: null,
  principalId:        null,

  avatar:             true,
  link:               true,
  size:               35,

  loading:            false,
  classNames:         ['gh-block'],
  attributeBindings:  ['aria-label: principal.name'],


  init() {
    this._super(...arguments);

    const store = get(this,'globalStore');
    const principalId = get(this, 'principalId');

    if ( get(this,'principal') || notFound[principalId] ) {
      return;
    }

    if ( principalId )
    {
      let principal = store.getById('principal', principalId);
      if ( principal ) {
        set(this,'principal', principal);
        return;
      }

      set(this,'loading', true);
      store.find('principal', principalId).then((principal) => {
        if ( this.isDestroyed || this.isDestroying ) {
          return;
        }

        set(this,'principal', principal);
      }).catch((/*err*/) => {
        // Do something..
        notFound[principalId] = true;
      }).finally(() => {
        if ( this.isDestroyed || this.isDestroying ) {
          return;
        }

        set(this,'loading', false);
      });
    }
  },

  avatarSrc: computed('principal', function() {
    return `data:image/png;base64,${new Identicon(AWS.util.crypto.md5(get(this, 'principal.id')||'Unknown', 'hex'), 80, 0.01).toString()}`;
  })

});
