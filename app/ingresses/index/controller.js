import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  projectController: controller('authenticated.project'),
  scope:             service(),

  group:             alias('projectController.group'),
  groupTableBy:      alias('projectController.groupTableBy'),

  queryParams:       ['sortBy'],
  sortBy:            'name',

  headers: [
    {
      name: 'state',
      sort: ['sortState','displayName'],
      searchField: 'displayState',
      translationKey: 'generic.state',
      width: 80,
    },
    {
      name: 'name',
      sort: ['sortName','id'],
      searchField: 'displayName',
      translationKey: 'generic.name',
      width: 200,
    },
    {
      name: 'targets',
      sort: false,
      search: false,
      translationKey: 'ingressPage.table.targets.label',
    },
    {
      name: 'created',
      sort: ['created','id'],
      searchField: 'created',
      translationKey: 'generic.created',
      width: 200,
    },
  ],

  balancerServices: computed('model.services.@each.kind', function() {
    return get(this,'model.services').filterBy('kind','LoadBalancer');
  }),

  rows: computed('model.ingresses.[]','balancerServices', function() {
    const out = (get(this,'balancerServices')||[]).slice();
    out.addObjects(get(this,'model.ingresses')||[]);
    return out;
  }),

});
