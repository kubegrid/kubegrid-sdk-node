'use strict';

const KubeGridResource = require('../KubeGridResource');
const KubeGridMethod = KubeGridResource.method;

module.exports = KubeGridResource.extend({
    path: 'clusters',

    includeBasic: ['create', 'list', 'retrieve', 'delete'],

    getKubeConfig: KubeGridMethod({
        method: 'GET',
        path: '/{cluster}/kubeconfig'
    }),

    getSshKey: KubeGridMethod({
        method: 'GET',
        path: '/{cluster}/ssh'
    }),

    getWindowsPassword: KubeGridMethod({
        method: 'GET',
        path: '/{cluster}/windows_pw'
    }),

    listLogs: KubeGridMethod({
        method: 'GET',
        path: '/{cluster}/logs'
    }),

    listNodes: KubeGridMethod({
        method: 'GET',
        path: '/{cluster}/nodes'
    }),

    addNodes: KubeGridMethod({
        method: 'POST',
        path: '/{cluster}/nodes'
    }),

    listApps: KubeGridMethod({
        method: 'GET',
        path: '/{cluster}/apps'
    }),

    attachApp: KubeGridMethod({
        method: 'POST',
        path: '/{cluster}/apps'
    }),

    deleteApp: KubeGridMethod({
        method: 'DELETE',
        path: '/{cluster}/apps/{appId}'
    }),

    deployApp: KubeGridMethod({
        method: 'POST',
        path: '/{cluster}/apps/{appId}/deploy'
    })


});
