import { get, set, observer } from '@ember/object';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  node: null,

  sortBy: 'key',
  descending: false,
  labelArray: null,

  headers: [
    {
      name: 'key',
      sort: ['key'],
      translationKey: 'systemInfoSection.key',
    },
    {
      name: 'value',
      sort: ['value', 'key'],
      translationKey: 'systemInfoSection.value',
    },
  ],

  annotationsObserver: observer('node', function () {
    const labelArray = this.getSystemInfoArray();
    set(this, 'labelArray', labelArray);
  }),

  didReceiveAttrs() {
    const labelArray = this.getSystemInfoArray();
    set(this, 'labelArray', labelArray);
  },

  getSystemInfoArray() {
    const array = [];
    const node = get(this, 'node');
    const info = get(node, 'info');
    const kubernetes = get(info, 'kubernetes');
    const os = get(info, 'os');
    const arch = (get(node, 'labels') || {})['beta.kubernetes.io/arch'];
    const osType = (get(node, 'labels') || {})['beta.kubernetes.io/os'];
    if (kubernetes) {
      array.push({
        key: 'systemInfoSection.kubeProxyVersion',
        value: get(kubernetes, 'kubeProxyVersion'),
      });
      array.push({
        key: 'systemInfoSection.kubeletVersion',
        value: get(kubernetes, 'kubeletVersion'),
      });
    }
    if (os) {
      array.push({
        key: 'systemInfoSection.dockerVersion',
        value: get(os, 'dockerVersion'),
      });
      array.push({
        key: 'systemInfoSection.kernelVersion',
        value: get(os, 'kernelVersion'),
      });
    }
    if (arch) {
      array.push({
        key: 'systemInfoSection.arch',
        value: arch,
      });
    }
    return array;
  }
});
