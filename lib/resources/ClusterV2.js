'use strict';

const KubeGridResource = require('../KubeGridResource');
const KubeGridMethod = KubeGridResource.method;

module.exports = KubeGridResource.extend({
    path: 'clusters',
    basePath: '/v2/',

    includeBasic: [],

    addNodes: KubeGridMethod({
        method: 'POST',
        path: '/{cluster}/nodes'
    }),

    removeNodes: KubeGridMethod({
        method: 'PATCH',
        path: '/{cluster}/nodes'
    })
});
